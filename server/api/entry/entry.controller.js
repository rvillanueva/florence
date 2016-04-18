/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/entries              ->  index
 * POST    /api/entries              ->  create
 * GET     /api/entries/:id          ->  show
 * PUT     /api/entries/:id          ->  update
 * DELETE  /api/entries/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Entry from './entry.model';

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

// Gets a list of Entrys
export function index(req, res) {
  return Entry.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Entry from the DB
export function show(req, res) {
  return Entry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Entry in the DB
export function create(req, res) {
  return Entry.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Entry in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Entry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Entry from the DB
export function destroy(req, res) {
  return Entry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Gets a single Entry from the DB
export function showUserEntries(req, res) {
  return Entry.find({'userId': req.params.userId}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
