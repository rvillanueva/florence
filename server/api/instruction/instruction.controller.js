/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/instructions              ->  index
 * POST    /api/instructions              ->  create
 * GET     /api/instructions/:id          ->  show
 * PUT     /api/instructions/:id          ->  update
 * DELETE  /api/instructions/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';

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

// Gets a list of Instructions
export function query(req, res) {
  var query = req.query;
  var term = query.q;
  var instruction = {
    text: term,
    measurement: {
      type: 'confidence'
    },
    action: {
      phrase: term,
      timing: {
        type: 'once',
        once: {
          comparator: 'on',
          date: new Date()
        }
      }
    }
  }
  console.log(typeof instruction)
  console.log(instruction)
  res.json(instruction);
}
