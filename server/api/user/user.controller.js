'use strict';

import User from '../../models/user/user.model';
import Program from '../../models/program/program.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

var Promise = require('bluebird');
var Dialog = require('../../services/dialog');
var TaskService = require('../../models/task');
var UserService = require('./user.service');
var EntryInterface = require('../../models/entry');
var InstructionService = require('../../models/instruction');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

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

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
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

  return User.find(query, 'identity instructions').lean().exec()
    .then(users => {
      users = attachEngagementScores(users);
      users = removeInstructions(users);
      return res.status(200).json(users);
    })
    .catch(handleError(res));

  function attachEngagementScores(patients){
    patients = patients || [];
    patients.forEach((patient, p) => {
      var finalScore;
      var totalScore = 0;
      var totalQuantity = 0;
      patient.instructions = patient.instructions || [];
      patient.instructions.forEach((instruction, i) => {
        if(instruction.adherence && instruction.adherence.score){
          totalScore += instruction.adherence.score;
          totalQuantity ++;
        }
      })
      if(totalQuantity){
        finalScore = totalScore/totalQuantity;
      }

      patient.adherence = {
        score: finalScore || 0
      }
    })
    return patients;
  }

  function removeInstructions(patients){
    patients.forEach((patient, p) => {
      delete patient.instructions;
    })
    return patients;
  }
}

/**
 * Creates a new user
 */
export function signup(req, res, next) {
  var newUserData = {
    provider: 'local',
    role: 'user',
    identity: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile
    },
    password: req.body.password,
    salt: req.body.salt
  }
  var newUser = new User(newUserData);
  newUser.provider = 'local';
  newUser.role = 'user';
  UserService.queueOnboardingTask(newUser)
    .then(user => user.save())
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
      mobile: req.body.mobile
    }
  }
  var newUser = new User(newUserData);
  newUser.provider = 'local';
  newUser.role = 'user';
  UserService.queueOnboardingTask(newUser)
    .then(user => user.save())
    .then(user => res.json(user))
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
        received: message
      }
      resolve(options);
    })
  }

}

export function entries(req, res){
  var userId = req.params.id;
  var query = {
    userId: userId
  }

  if(req.query){
    query.params = req.query;
  }

  return EntryInterface.get(query)
  .then(respondWithResult(res))
  .catch(handleError(res));
}
