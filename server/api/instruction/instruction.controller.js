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
var Parser = require('../../components/parser');
var NotificationService = require('../../components/notifications');
var Promise = require('bluebird');
var InstructionService = require('../../components/instruction');
import User from '../../models/user/user.model';


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
  var text = req.query.q;
  var query = {
    text: text
  }
  Parser.classify(query)
  .then(parsed => buildInstruction(parsed))
  .then(respondWithResult(res, 200))
  .catch(handleError(res))

  function buildInstruction(parsed){
    return new Promise(function(resolve, reject){
      var instruction = {
        text: query.text,
        action: {}
      }
      console.log(JSON.stringify(parsed))

      attachActionPhrase();
      attachTimingType();
      attachTimingTimes();
      attachTimingEvery();
      resolve(instruction);

      ///

      function attachActionPhrase(){
        if(parsed.entities.action_phrase && parsed.entities.action_phrase.length > 0){
          instruction.action.phrase = parsed.entities.action_phrase[0].value;
        } else {
          instruction.action.phrase = text;
        }
      }

      function attachTimingType(){
        var timingType;
        if(parsed.entities.timing_type && parsed.entities.timing_type.length > 0){
          timingType = parsed.entities.timing_type[0].value;
        }
        if(timingType !== 'once' && timingType !== 'repeating'){
          timingType = 'general';
        }
        instruction.action.timing = {
          type: timingType
        }
      }

      function attachTimingTimeframe(){
        if(parsed.entities.datetime && parsed.entities.datetime.length > 0){
          if(parsed.entities.datetime[0].type == 'interval'){
            instruction.action.timeframe = {
              from: parsed.entities.datetime[0].value.from,
              to: parsed.entities.datetime[0].value.to
            }
          } else if (parsed.entities.datetime[0].type == 'value'){
            instruction.action.timeframe = {
              from: parsed.entities.datetime[0].value,
              to: parsed.entities.datetime[0].value
            }
          }
        }
      }

      function attachTimingTimes(){
        if(parsed.entities.repeating_times && parsed.entities.repeating_times.length > 0){
          instruction.action.timing.times = parsed.entities.repeating_times[0].value
        }
        if(parsed.entities.repeating_times_synonym && parsed.entities.repeating_times_synonym.length > 0){
          instruction.action.timing.times = instruction.action.timing.times || Number(parsed.entities.repeating_times_synonym[0].value)
        }
        if(parsed.entities.number && parsed.entities.number.length > 0 && instruction.action.timing.type == 'repeating'){
          instruction.action.timing.times = instruction.action.timing.times || Number(parsed.entities.number[0].value)
        }

      }

      function attachTimingEvery(){
        if(parsed.entities.repeating_every && parsed.entities.repeating_every.length > 0){
          instruction.action.timing.every = parsed.entities.repeating_every[0].value
        }
      }

    })
  }

}

export function notify(req, res){
  console.log('Notifying.')
  console.log('Service running...')
  User.find({'$or':[{
    'notifications.nextContact':{ '$lt': new Date() }
  },
  {
    'notifications.nextContact': null
  }]}, '-salt -password')
  .then(users => addTasksForEach(users))
  .then(users => NotificationService.notifyReadyUsers(users))
  .then(() => {
    console.log('Done')
    res.status(200).end()
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
}


function addTasksForEach(users){
  console.log('Adding tasks...')
  var promises = [];
  var updatedUsers = [];

  return new Promise(function(resolve, reject){
    users = users || [];
    console.log(users)
    users.forEach(function(user, u){
      promises.push(queueTasks(user));
    })

    Promise.all(promises)
    .then(() => resolve(updatedUsers))
    .catch(err => reject(err))
  })

  function queueTasks(user){
    console.log('Queueing tasks...');
    return new Promise(function(resolve, reject){
      InstructionService.queueTasks(user)
      .then(user => {
        updatedUsers.push(user)
        resolve()
      })
      .catch(err => reject(err))
    })
  }
}

export function update(req, res){
  var instructionId = req.params.id;
  var updates = req.body;
  return User.findOneAndUpdate({'instructions._id': instructionId}, {
      "$set": {
          "instructions.$.measurement": updates.measurement,
          "instructions.$.archived": updates.archived,
      }
  }).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}


export function create(req, res){
  var userId = req.query.userId;
  var instruction = req.body;
  console.log(instruction)
  return User.findOne({'_id': userId}, '-salt -password').exec()
  .then(user => {
    return new Promise(function(resolve, reject){
      if(!user){
        resolve(null)
      }
      user.instructions = user.instructions || [];
      user.instructions.push(instruction);
      user.save()
      .then(user => resolve(user))
      .catch(err => reject(err))
    })
  })
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}
