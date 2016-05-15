/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/intents              ->  index
 * POST    /api/intents              ->  create
 * GET     /api/intents/:id          ->  show
 * PUT     /api/intents/:id          ->  update
 * DELETE  /api/intents/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Conversation from '../conversation/conversation.model';
import Intent from './intent.model';
var Promise = require('bluebird');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function attachConversations(res) {
  return function(entities) {
    return new Promise(function(resolve, reject){
      if (entities) {
        var conversationIds = [];
        entities.forEach(function(intent, i){
          if(intent.conversationId){
            conversationIds.push(intent.conversationId)
          }
        });
        Conversation.find({'_id': {
          $in: conversationIds
        }}, 'name').exec()
        .then(conversations => {
          entities.forEach(function(intent, i){
            conversations.forEach(function(conversation, c){
              if(intent.conversationId == conversation._id){
                intent.conversation = conversation;
                console.log(intent)
              }
            })
          })
          resolve(entities)
        })
      } else {
        resolve(null)
      }
    })
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

// Gets a list of Intents
export function index(req, res) {
  return Intent.find().lean().exec()
    .then(attachConversations(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Intent from the DB
export function show(req, res) {
  return Intent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Intent in the DB
export function create(req, res) {
  return Intent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Intent in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Intent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Intent from the DB
export function destroy(req, res) {
  return Intent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
