'use strict';

import User from '../../models/user/user.model';
import Program from '../../models/program/program.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

var Promise = require('bluebird');
var Dialog = require('../../components/dialog');
var TaskService = require('../../models/task');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  req.query = req.query || {};
  var query = {};
  var conditions = []
  if (req.query.lastName) {
    conditions.push({
      'identity.lastName': new Regex(req.query.lastName)
    })
  }
  if (req.query.phone) {
    conditions.push({
      'identity.mobile': new Regex(req.query.phone)
    })
  }

  if (conditions.length > 0) {
    query = {
      '$and': conditions
    }
  }

  return User.find(query, 'identity').exec()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUserData = {
    provider: 'local',
    role: 'user',
    identity: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: {
        number: req.body.mobile
      }
    },
    password: req.body.password,
    salt: req.body.salt
  }
  var newUser = new User(newUserData);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({
        _id: user._id
      }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({
        token
      });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId, '-salt -password').lean().exec()
    .then(user => attachTasks(user))
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));

    function attachTasks(user) {
      return new Promise(function(resolve, reject) {
        TaskService.attach(user.queue)
          .then(queue => {
            user.queue = queue;
            resolve(user);
          })
          .catch(err => reject(err))
      })
    }

}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({
      _id: userId
    }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}


export function notify(req, res, next) {
  return User.findById(req.params.id, '-salt -password').exec()
    .then(user => {
      if (!user) {
        return res.status(404).end()
      }
      return setupBotOptions(user, null)
    })
    .then(options => Dialog.notify(options))
    .then(bot => {
      var queue = bot.queue.toObject();
      return TaskService.attach(queue)
    })
    .then(queue => {
      return res.json(queue);
    })
    .catch(err => next(err))


  function setupBotOptions(user, message) {
    return new Promise(function(resolve, reject) {
      var options = {
        user: user,
        state: user.state,
        received: message
      }
      resolve(options);
    })
  }

}



/**
 * Add a program to user profile
 */
export function addProgram(req, res, next) {
  var userId = req.params.id;
  var programId = String(req.body.programId);

  return User.findById(userId).exec()
    .then(user => pushProgram(user, programId))
    .then(user => {
      if (!user) {
        return res.status(401).end();
      } else {
        User.findOneAndUpdate({
            '_id': userId
          }, user)
          .then(user => {
            return res.json(user)
          })
          .catch(handleError(res))
      }
    });
}

function pushProgram(user, programId) {
  return new Promise(function(resolve, reject) {
    if (!user) {
      resolve(false)
    }
    user.programs = user.programs || [];
    user.programs.forEach(function(program, p) {
      if (program.programId == programId) {
        return res.status(409).end('Program already present.')
      }
    })
    var newProgram = {
      programId: programId
    }
    user.programs.push(newProgram)
    resolve(user);
  })
}
