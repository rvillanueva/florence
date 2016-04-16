/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/belief              ->  index
 * POST    /api/belief              ->  create
 * GET     /api/belief/:id          ->  show
 * PUT     /api/belief/:id          ->  update
 * DELETE  /api/belief/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Belief from './belief.model';

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

// Gets a list of Beliefs
export function index(req, res) {
  return Belief.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Belief from the DB
export function show(req, res) {
  return Belief.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Belief in the DB
export function create(req, res) {
  return Belief.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Belief in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Belief.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Belief from the DB
export function destroy(req, res) {
  return Belief.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
