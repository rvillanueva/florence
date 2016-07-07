/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/programs              ->  index
 * POST    /api/programs              ->  create
 * GET     /api/programs/:id          ->  show
 * PUT     /api/programs/:id          ->  update
 * DELETE  /api/programs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Promise = require('bluebird');

import Program from '../../models/program/program.model';
import Task from '../../models/task/task.model';

function attachTasks(entity) {
    return new Promise(function(resolve, reject){
      if(entity && entity.bids){
        getTasks();
      } else {
        resolve(entity);
      }

      function getTasks(){
        var taskIds = [];
          entity.bids.forEach(function(bid, b){
            taskIds.push(bid.target.taskId)
          })
          Task.find({'_id': {'$in': taskIds}}).exec()
          .then(tasks => {
            entity.tasks = tasks;
            resolve(entity);
          })
          .catch(err => reject(err))
      }
    })
}

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

// Gets a list of Programs
export function index(req, res) {
  return Program.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Program from the DB
export function show(req, res) {
  return Program.findById(req.params.id).lean().exec()
    .then(entity => attachTasks(entity))
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Program in the DB
export function create(req, res) {
  return Program.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Program in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Program.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Program from the DB
export function destroy(req, res) {
  return Program.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
