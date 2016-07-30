'use strict';

var Promise = require('bluebird');
var moment = require('moment');

export function queueTasks(user) {
  return new Promise(function(resolve, reject){
    var promises = [];

    user.queue = user.queue || [];
    user.instructions = user.instructions || [];
    user.instructions.forEach(function(instruction, i) {
      if (lastEntryIsOutdated(instruction)) {
        promises.push(addIfNotQueued(instruction));
      }
    })

    Promise.all(promises)
    .then(() => resolve(user))
    .catch(err => reject(err))

    function lastEntryIsOutdated(instruction){
      instruction.measurement = instruction.measurement || {};
      var lastEntryDate = moment(instruction.lastEntry);
      var measurementFreq = instruction.measurement.frequency || 'weekly';
      var now = moment();
      if(!lastEntryDate){
        return true;
      } else if (measurementFreq == 'daily' && lastEntryDate.subtract(20, 'hours') > now) {
        return true;
      } else if (measurementFreq == 'weekly' && lastEntryDate.subtract(6, 'days') > now) {
        return true;
      } else {
        console.log('ERROR: No measurement on instruction ' + instruction._id)
        return false;
      }
    }

    function addIfNotQueued(instruction) {
      return new Promise(function(resolve, reject){
        if (!isInstructionQueued(instruction) && instruction.measurement) {
          // find appropriate task, attach params and queue it;
          var taskQuery = buildTaskQuery(instruction);
          TaskService.search(taskQuery)
          .then(task => addToQueue(task, taskQuery, instruction))
          .then(() => resolve())
          .catch(err => reject(err))
        }
      })
    }

    function addToQueue(task, query, instruction){
      var todo = {
        taskId: task._id,
        instructionId: instruction._id,
        params: query.params
      }
      user.queue.push(todo);
    }

    function isInstructionTaskQueued(instruction) {
      var found = false;
      user.queue.forEach(function(queued, q) {
        if (queued.instructionId == instruction._id) {
          found = true;
        }
      })
      return found;
    }

    function buildTaskQuery(instruction){
      var taskQuery = {
        objective: 'measureInstruction',
        params: instruction.action.params || {}
      }
      taskQuery.params.measurementType = instruction.measurement.type;
      taskQuery.params.measurementFreq = instruction.measurement.frequency;
      taskQuery.params.actionPhrase = instruction.action.phrase;

      if (instruction.action.timing) {
        taskQuery.params.timingType = instruction.action.timing.type;
        taskQuery.params.timingTimes = instruction.action.timing.times;
        taskQuery.params.timingEvery = instruction.action.timing.every;
        if(instruction.action.timing.timeframe){
          taskQuery.params.timingTimeframeFrom = instruction.action.timing.timeframe.from;
          taskQuery.params.timingTimeframeTo = instruction.action.timing.timeframe.to;
        }
      }
      return taskQuery;
    }

  })
}
