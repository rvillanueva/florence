'use strict';

import User from '../../models/user/user.model';

var Promise = require('bluebird');
var moment = require('moment');
var TaskService = require('../task');
var NotificationService = require('../notification');
var EntryInterface = require('../../models/entry');
var moment = require('moment');

export function runCheckIns(users){
  return new Promise(function(resolve, reject){
    User.find({'$or':[{
      'notifications.nextContact':{ '$lt': new Date() }
    },
    {
      'notifications.nextContact': null
    }]}, '-salt -password')
    .then(users => addTasksForEach(users))
    .then(users => NotificationService.notifyReadyUsers(users))
    .then(users => resolve(users))
    .catch(err => reject(err))
  })

  function addTasksForEach(users){
    var promises = [];

    return new Promise(function(resolve, reject){
      users = users || [];
      users.forEach(function(user, u){
        promises.push(queueTasks(user));
      })

      Promise.all(promises)
      .then(users => resolve(users))
      .catch(err => reject(err))
    })

  }
}

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
        if (!isInstructionTaskQueued(instruction, user.queue) && instruction.measurement) {
          console.log('Instruction isn\'t queued...');
          // find appropriate task, attach params and queue it;
          buildTaskQuery(instruction)
          .then(query => TaskService.query(query))
          .then(task => addToQueue(task))
          .then(() => resolve())
          .catch(err => reject(err))
        }
      })
    }

    function addToQueue(task){
      if(task){
        var todo = {
          taskId: task._id,
          params: task.query.params
        }
        user.queue.push(todo);
      } else {
        console.log('No task added.')
      }
    }

  })
}

function isInstructionTaskQueued(instruction, queue) {
  console.log('Checking if instruction is queued...')
  var found = false;
  queue = queue || [];
  queue.forEach(function(queued, q) {
    queued.params = queued.params || {};
    if (queued.params.instructionId == instruction._id) {
      found = true;
    }
  })
  return found;
}

export function queue(instructionId){
  return new Promise(function(resolve, reject){
    var instruction;
    var user;
    User.findOne({'instructions._id': instructionId})
    .then(returned => {
      if(!returned){
        reject(new Error('No instruction found with _id ' + instructionId));
      }
      user = returned;
      user.queue = user.queue  || [];
      user.instructions = user.instructions || [];
      user.instructions.forEach(function(item, i){
        if(item._id == instructionId){
          instruction = item;
        }
      })
      if(!isInstructionTaskQueued(instruction, user.queue)){
        return buildTaskQuery(instruction)
      } else {
        resolve(false)
      }
    })
    .then(query => TaskService.query(query))
    .then(task => {
      if(!task){
        reject(new Error('No task matches instruction with _id ' + instructionId))
      }
      var todo = {
        taskId: task._id,
        params: task.query.params
      }
      user.queue.push(todo);
      return user.save()
    })
    .then(user => {
      user = user.toObject();
      return TaskService.attach(user.queue)
    })
    .then(queue => resolve(queue))
    .catch(err => reject(err))
  })

}

export function buildTaskQuery(instruction){
  return new Promise(function(resolve, reject){
    var taskQuery = {
      objective: 'measureInstruction',
      params: instruction.action.params || {}
    }
    taskQuery.params.instructionId = String(instruction._id);
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
    resolve(taskQuery);

  })
}

export function updateAdherenceScore(instructionId){
  var entryQuery = {
    params: {
      instructionId: instructionId
    }
  }
  return new Promise(function(resolve, reject){
    if(!instructionId){
      reject(new Error('Need instructionId to update adherence score.'))
    }
    EntryInterface.get(entryQuery)
    .then(entries => calculateInstructionScore(entries))
    .then(score => {
      return User.findOneAndUpdate({'instructions._id': instructionId}, {
          "$set": {
              "instructions.$.adherence.score": score
          }
      }).exec()
    })
    // TODO add user adeherence scoring here
    .then(() => resolve(true))
    .catch(err => reject(err))
  })

  function calculateInstructionScore(entries){
    return new Promise(function(resolve, reject){
      entries = entries || [];
      var taggedArray = [];
      var weightsTotal = 0;
      var weightedScoreTotal = 0;
      var instructionScore = false;
      entries.forEach(function(entry, e){
        var score = calculateEntryScore(entry);
        var weight = calculateEntryWeight(entry);
        if(typeof score == 'number' && typeof weight == 'number'){
          weightedScoreTotal += score * weight;
          weightsTotal += weight;
        }
      })
      if(weightsTotal > 0){
        instructionScore = weightedScoreTotal/weightsTotal;
      }
      if(entries.length == 0){
        instructionScore = 1;
      }
      if(instructionScore > 1 || instructionScore < 0){
        reject(new Error('Instruction score for instruction _id: ' + instructionId + ' is invalid.'))
      } else {
        resolve(instructionScore);
      }
    })
  }

  function calculateEntryScore(entry){
    entry.meta = entry.meta || {};
    entry.meta.params = entry.meta.params || {};
    entry.value = entry.value || {};
    var measurementType = entry.meta.params.measurementType;
    var timingTimes = entry.meta.params.timingTimes;
    if(measurementType == 'futureConfidence' && isOneToFive(entry.value.number)){
      return entry.value.number/5;
    } else if (measurementType == 'propensity' && isOneToFive(entry.value.number)) {
      return entry.value.number/5;
    } else if (measurementType == 'completedFrequency' && isNumber(entry.value.number)) {
      return entry.value.number/timingTimes;
    } else if (measurementType == 'missedFrequency' && isNumber(entry.value.number)) {
      return (timingTimes - entry.value.number)/timingTimes;
    } else if (measurementType == 'taskCompletion' && isString(entry.value.string)){
      if(entry.value.string == 'yes'){
        return 1;
      } else {
        return 0;
      }
    } else {
      return false;
    }

    function isNumber(number){
      return (typeof number == 'number');
    }

    function isString(string){
      return (typeof string == 'string');
    }

    function isOneToFive(number){
      if(typeof number == 'number' && number >= 1 && number <= 5){
        return true;
      } else {
        return false;
      }
    }
  }

  function calculateEntryWeight(entry){
    // TODO default use month, but need to parametrize
    var now = moment();
    var fromDate = moment().subtract(30, 'days');
    var creation = moment(entry.meta.created);
    var duration = moment.duration(now.diff(creation));
    var hours = duration.asHours();
    var maxHours = moment.duration(now.diff(fromDate)).asHours()
    var weight = (maxHours + 100)/(hours + 100);
    if(weight > 0){
      return weight;
    } else {
      console.log('Error: weight was ' + weight + ', time at ' + moment(creation).format('MMM DD YYYY HH:mm a') + '. Hours: ' + hours + ', maxhours: ' + maxHours);
      return 0;
    }
  }
}
