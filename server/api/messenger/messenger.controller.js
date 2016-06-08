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
var Message = require('../../components/message');
var Dialog = require('../../components/dialog-manager');
import User from '../user/user.model';
var UserService = require('../user/user.model');

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

function handleEachMessage(messages){
  return new Promise(function(resolve, reject){
    var promises = [];
    messages.forEach(function(message, m){
      promises.push(handleMessage(message));
    });
    Promise.all(promises)
    .then(() => resolve(true))
    .catch(err => reject(err))
  })

  function handleMessage(message){
    return new Promise(function(resolve, reject){
      console.log('Received:')
      console.log(message);
      UserService.getUserByMessengerId(message.messenger.id)
      .then(user => attachUserIdToMessage(message, user))
      .then(message => Dialog.respond(message))
      .then(() = resolve(true))
      .catch(err => reject(err))
    })

    function attachUserIdToMessage(message, user){
      return new Promise(function(resolve, reject){
        message.userId = user._id;
        resolve(message)
      })
    }
  }

}

// Facebook Messenger Webhook. Should respond with the challenge
export function webhook(req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_MESSENGER_VERIFY) {
      return res.status(200).send(req.query['hub.challenge']);
    } else {
      return res.status(403).send('Incorrect validation token.');
    }
}

export function receive(req, res) {
  return new Promise(function(resolve, reject){
    Message.standardize(req.body, 'messenger')
    .then(messages => handleEachMessage(messages))
    .then(() => resolve(res.status(200).end()))
    .catch(err => reject(err))
  })
}
