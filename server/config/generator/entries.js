'use strict';

import User from '../../models/user/user.model';
var InstructionService = require('../../services/instruction');
var TaskService = require('../../services/task');
var moment = require('moment');

export function generate(params) {
  return new Promise(function(resolve, reject){
    params = params || {};
    params.users = params.users || [];
    params.missChance = params.missChance || 0.2;
    var users = params.users;
    var promises = [];
    users.forEach(function(user, u) {
      promises.push(generateUserEntries(user));
    })
    Promise.all(promises)
    .then(blocks =>  unwrapThrice(blocks))
    .then(entries => resolve(entries))
    .catch(err => reject(err))
  })

  function unwrapThrice(blocks){
    var entries = [];
    blocks.forEach(function(first, f){
      first.forEach(function(second, s){
        second.forEach(function(third, t){
          entries.push(third);
        })
      })
    })
    return entries;
  }

  function generateUserEntries(user) {
    return new Promise(function(resolve, reject) {
      var promises = [];
      user.instructions = user.instructions || [];
      user.instructions.forEach(function(instruction, i) {
        instruction.measurement = instruction.measurement || {};
        if (instruction.measurement.period == 'day') {
          promises.push(generateData(instruction, 'days', 30))
        } else {
          promises.push(generateData(instruction, 'weeks', 6))
        }
      })
      Promise.all(promises)
        .then(entries => resolve(entries))
        .catch(err => reject(err))
    })

    function generateData(instruction, spacing, quantity) {
      return new Promise(function(resolve, reject) {
        var promises = [];
        for (var i = 0; i < quantity; i++) {
          var isHit = (Math.random() > params.missChance);
          if (isHit) {
            promises.push(buildEntryFromInstruction(instruction, i))
          }
        }
        Promise.all(promises)
          .then(entries => resolve(entries))
          .catch(err => reject(err))
      })

      function buildEntryFromInstruction(instruction, i) {
        var params;
        return new Promise(function(resolve, reject) {
          var entry = {
            userId: String(user._id),
            meta: {
              created: moment().subtract(i, spacing).toDate()
            },
            value: generateValue(instruction)
          }
          InstructionService.buildTaskQuery(instruction)
            .then(query => {
              params = query.params;
              return TaskService.query(query)
            })
            .then(task => {
              if(task){
                entry.meta.prompt = task.text;
              }
              entry.meta.params = params;
              resolve(entry);
            })
            .catch(err => reject(err))
        })
      }

    }

    function generateValue(instruction) {
      if (
        instruction.measurement.type == 'futureConfidence' ||
        instruction.measurement.type == 'propensity' ||
        instruction.measurement.type == 'futureConfidence'
      ) {
        return {
          number: Math.floor(Math.random() * 5) + 1
        }
      } else if (instruction.measurement.type == 'completedFrequency') {
        return {
          number: Math.floor(Math.random() * instruction.action.timing.times) + 1
        }
      } else if (instruction.measurement.type == 'missedFrequency') {
        return {
          number: Math.floor(Math.random() * instruction.action.timing.times) + 1
        }
      } else if (instruction.measurement.type == 'taskCompleted') {
        var flip = Math.floor(Math.random() * 2);
        if (flip) {
          return {
            string: 'yes'
          }
        } else {
          return {
            string: 'no'
          }
        }
      } else {
        return {
          string: '[unrecognized input]'
        };
      }
    }
  }
}
