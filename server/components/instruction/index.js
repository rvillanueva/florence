'use strict';

var Promise = require('bluebird');
var moment = require('moment');
var TaskService = require('../task');

export function queueTasks(user) {
  return new Promise(function(resolve, reject){
    var promises = [];

    console.log('Instruction service executing for user: ' + user.identity.firstName + ' ' + user.identity.lastName);

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
      console.log('Checking if last entry outdated....')
      instruction.measurement = instruction.measurement || {};
      var lastEntryDate = moment(instruction.lastEntry);
      var measurementFreq = instruction.measurement.frequency || 'weekly';
      var now = moment();
      if(!lastEntryDate){
        return true;
      } else if (measurementFreq == 'daily' && lastEntryDate.subtract(20, 'hours') < now) {
        return true;
      } else if (measurementFreq == 'weekly' && lastEntryDate.subtract(6, 'days') < now) {
        return true;
      } else {
        return false;
      }
    }

    function addIfNotQueued(instruction) {
      return new Promise(function(resolve, reject){
        console.log('Adding if not queued...')
        if (!isInstructionTaskQueued(instruction) && instruction.measurement) {
          console.log('Instruction isn\'t queued...');
          // find appropriate task, attach params and queue it;
          var taskQuery = buildTaskQuery(instruction);
          TaskService.query(taskQuery)
          .then(task => addToQueue(task, taskQuery, instruction))
          .then(() => resolve())
          .catch(err => reject(err))
        }
      })
    }

    function addToQueue(task, query, instruction){
      if(task && instruction){
        var todo = {
          taskId: task._id,
          params: query.params
        }
        user.queue.push(todo);
        console.log('Todo was added:')
        console.log(todo);
      } else {
        console.log('No task added.')
      }
    }

    function isInstructionTaskQueued(instruction) {
      console.log('Checking if instruction is queued...')
      var found = false;
      user.queue.forEach(function(queued, q) {
        queued.params = queued.params || {};
        if (queued.params.instructionId === instruction._id) {
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
      taskQuery.params.instructionId = instruction._id;
      taskQuery.params.measurementType = instruction.measurement.type;
      taskQuery.params.measurementPeriod = instruction.measurement.period;
      // TODO update to explicitly set measurement period instead of inferring from measurement frequency
      if(instruction.measurement.frequency == 'daily'){
        taskQuery.params.measurementPeriod = taskQuery.params.measurementPeriod || 'day'
      } else if (instruction.measurement.frequency == 'weekly'){
        taskQuery.params.measurementPeriod = taskQuery.params.measurementPeriod || 'week'

      }
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
