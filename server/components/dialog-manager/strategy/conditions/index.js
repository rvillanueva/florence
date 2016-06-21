'use strict';

var Promise = require('bluebird');
var Conversation = require('../conversation');

// Filter tasks

var checkCondition = {
  entityMatch: function(bot, condition) {
    return new Promise(function(resolve, reject) {
      for (var param in condition.params) {
        if (condition.params.hasOwnProperty(param)) {
          if (bot.conversation.entities[param] !== condition.params[param]) {
            resolve(false)
          }
        }
      }
      resolve(true)
    })
  }
}

export function filterTasks(bot) {
  return new Promise(function(resolve, reject) {
    var promises = [];
    bot.cache.tasks.forEach(function(task, t) {
      promises.push(returnIfValid(task))
    })

    Promise.all(promises)
      .then(tasks => {
        bot.cache.tasks = tasks;
        resolve(bot)
      })
      .catch(err => reject(err))

    function returnIfValid(task) {
      return new Promise(function(resolve, reject) {
        task.conditions = task.conditions || [];
        task.conditions.forEach(function(condition, c) {
          var conditionPromises = [];
          if (typeof checkCondition[condition.type] == 'function') {
            conditionPromises.push(checkCondition(condition))
          } else {
            reject(new TypeError(condition.type + ' from task ' + task._id + ' is not a valid condition type.'))
          }

          Promise.all(conditionPromises)
            .then(bools => {
              bools.forEach(function(bool, b) {
                if (bool !== true) {
                  resolve(null);
                }
              })
              resolve(task);
            })
            .catch(err => reject(err))
        })
      })
    }
  })
}
