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

function attachTasks(program) {
    return new Promise(function(resolve, reject){
      console.log('attaching tasks...')
      var taskIndex = {};
      program.protocols = program.protocols || [];
      getTasks();

      function getTasks(){
        var taskIds = [];
          program.protocols.forEach(function(protocol, p){
            taskIds.push(protocol.taskId)
          })
          Task.find({'_id': {'$in': taskIds}}).exec()
          .then(tasks => {
            tasks.forEach(function(task, t){
              taskIndex[task._id] = task;
            })
            program.protocols.forEach(function(protocol, p){
              protocol.task = taskIndex[protocol.taskId];
            })
            console.log('resolving after attaching...')
            console.log(program)
            resolve(program);
          })
          .catch(err => reject(err))
      }
    })
}

function convertToTaskIds(program){
    program.protocols = program.protocols || [];
    program.protocols.forEach(function(protocol, p){
      protocol.taskId = protocol.task._id;
      delete protocol.task;
    })
    console.log(program)
    return program;
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
    entity.protocols = [];
    console.log('saving updates')
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        var leanObject = updated.toObject();
        console.log(leanObject)
        return leanObject;
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
  var program = req.body;
  convertToTaskIds(req.body);
  return Program.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(program => attachTasks(program))
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
