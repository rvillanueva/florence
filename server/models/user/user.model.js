'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';
import Instruction from '../instruction/instruction.model';

const authTypes = ['mobile'];

var phone = require('phone');

var UserSchema = new Schema({
  identity: {
    pictureUrl: String,
    firstName: String,
    lastName: String,
    email: {
      type: String,
      lowercase: true
    },
    mobile: String,
  },
  permissions: {
    mobile: {

    },
    documentation: [
      {
        permission: String,
        created: Date,
        userId: String,
        initials: String
      }
    ]
  },
  providers: {
    auth: String,
    messaging: String
  },
  settings: {
    timezone: String,
  },
  demographics: {
    gender: String,
  },
  role: {
    type: String,
    default: 'user'
  },
  active: Boolean,
  password: {
    type: String,
    select: false
  },
  salt: {
    type: String,
    select: false
  },
  created: Date,
  lastActivity: Date,
  queue: [{
    taskId: String,
    params: {},
    immediate: Boolean,
    started: Date,
    added: Date
  }],
  state: {
    status: String,
    active: {
      taskId: String,
      params: {}
    },
    updated: Date
  },
  notifications: {
    lastContact: Date,
    nextContact: Date,
    attempts: Number,
    target: {
      hour: Number,
      dayOfWeek:Number
    }
  },
  instructions: [Instruction.schema]
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    var user = this;
    return {
      '_id': this._id,
      'identity': this.identity,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

 // Validate empty first name and last names
 UserSchema
   .path('identity.firstName')
   .validate(function(firstName) {
     firstName = firstName || '';
     if (authTypes.indexOf(this.providers.auth) !== -1) {
       return true;
     }
     return firstName.length;
   }, 'First name cannot be blank');

   UserSchema
     .path('identity.lastName')
     .validate(function(lastName) {
       lastName = lastName || '';
       if (authTypes.indexOf(this.providers.auth) !== -1) {
         return true;
       }
       return lastName.length;
     }, 'Last name cannot be blank');


// Validate email is not taken
UserSchema
  .path('identity.email')
  .validate(function(value, respond) {
    var self = this;
    if(!value || value.length == 0){
      this.identity.email = null;
      return respond(true);
    }
    return this.constructor.findOne({ 'identity.email': value }).exec()
      .then(function(user) {
        if (user) {
          if (self.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

// Validate mobile phone number isn't taken
  UserSchema
    .path('identity.mobile')
    .validate(function(mobile, respond) {
      var self = this;
      if(!mobile || mobile.length == 0){
        this.identity.mobile = null;
        return respond(true);
      }
      return this.constructor.findOne({ 'identity.mobile': mobile }).exec()
        .then(function(user) {
          if (user) {
            if (self.id === user.id) {
              return respond(true);
            }
            return respond(false);
          }
          return respond(true);
        })
        .catch(function(err) {
          throw err;
        });
    }, 'The specified phone number is already in use.');

    // Validate phone number structure
    UserSchema
      .path('identity.mobile')
      .validate(function(mobile) {
        if(!mobile){
          return true;
        } else {
          var formatted = phone(mobile);
          if(formatted.length > 0){
            this.identity.mobile = formatted[0];
            return true;
          } else {
            return false;
          }
        }
      }, 'Please provide a valid phone format.');


var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.providers.auth) === -1) {
      return next(new Error('Invalid password'));
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64');
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err);
      } else {
        callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                   .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        callback(err);
      } else {
        callback(null, key.toString('base64'));
      }
    });
  }
};

export default mongoose.model('User', UserSchema);
