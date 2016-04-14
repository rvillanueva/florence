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
import Thing from '../thing/thing.model';

var Messenger = require('../../components/messages/messenger');

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

// Facebook Messenger Webhook. Should respond with the challenge
export function webhook(req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_MESSENGER_VERIFY) {
      return res.status(200).send(req.query['hub.challenge']);
    } else {
      return res.status(403).send('Error, wrong validation token');
    }
}

export function receive(req, res) {
  console.log(JSON.stringify(req.body));
      Messenger.receive(req.body);
      return res.status(200).end();
}
