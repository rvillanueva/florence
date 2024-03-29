/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/conversation              ->  index
 * POST    /api/conversation              ->  create
 * GET     /api/conversation/:id          ->  show
 * PUT     /api/conversation/:id          ->  update
 * DELETE  /api/conversation/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';

var Promise = require('bluebird');
var Message = require('../../services/message');
var Dialog = require('../../services/dialog');
var UserService = require('../../services/user');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}


function handleMessage(message){
  return new Promise(function(resolve, reject){
    console.log('Received:')
    console.log(message);
    UserService.getUserByPhoneNumber(message.from.mobile)
    .then(user => handleReply(user))
    .then(() => resolve(true))
    .catch(err => reject(err))
  })
  function handleReply(user){
    return new Promise(function(resolve, reject){
      if(user && user.active){
        setupBotOptions(user, message)
        .then(options => Dialog.respond(options))
        .then(() => resolve(true))
        .catch(err => reject(err))
      } else {
        replyToInactiveUser(user)
        .then(() => resolve(true))
        .catch(err => reject(err))
      }
    })
  }

  function setupBotOptions(user, message){
    return new Promise(function(resolve, reject){
      var options = {
        user: user,
        state: user.state,
        received: message
      }
      options.received.userId = user._id;
      resolve(options);
    })
  }

  function replyToInactiveUser(user){
    return new Promise(function(resolve, reject){
      console.log('Sending inactive user reply...')
      var sendable = {
        userId: user._id,
        to: {
          provider: 'sms',
          mobile: user.identity.mobile,
        },
        content: {
          text: 'Sorry, it looks like this number has not yet been activated in our system. If you think this is in error, talk with your referring care provider.'
        }
      }
      Message.send(sendable)
      .then(() => resolve(user))
      .catch(err => reject(err))
    })
  }

}

export function receive(req, res) {
  return new Promise(function(resolve, reject){
    Message.standardize(req.body, 'twilioSMS')
    .then(message => handleMessage(message))
    .then(() => respondOk())
    .catch(err => reject(err))

    function respondOk(){
      resolve(res.status(200).end())
    }
  })
}
