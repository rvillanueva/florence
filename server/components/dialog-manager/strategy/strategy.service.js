'use strict';

var Promise = require('bluebird');
var Task = require('../task/task.model');

// NEXT TASK HANDLING

export function initScoreMap(bot) {
  return new Promise(function(resolve, reject) {
    Task.get(bot)
    .then(bot => Task.buildIndex(bot))
    .then(bot => {
      bot.cache.scores = [];
      // Push a score holder referencing each task
      bot.cache.tasks.forEach(function(task, t) {
        var score = {
          task: bot.cache.taskMap[task._id],
          value: 1
        }
        bot.cache.scores.push(score);
      })
      resolve(bot);
    })
    .catch(err => reject(err))
  })
}

// Select best task based on scores
// INPUT: cache.tasks
// OUTPUT: cache.task
export function selectTopTask(bot) {
  return new Promise(function(resolve, reject) {

    if (bot.cache.scores.length == 0) {
      bot.cache.task = null;
      resolve(bot);
    } else {

      // Sort score map by score
      bot.cache.tasks.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      // Sort score map by forced = true
      bot.cache.tasks.sort(function(a, b) {
        if(a.force && !b.force){
          return 1;
        } else if(!a.force && b.force){
          return -1;
        } else {
          return 0;
        }
      });

      // Select best
      bot.cache.task = bot.cache.tasks[0];

      // Return associated task
      resolve(bot);
    }
  })
}


// RESPONSE HANDLING


export function handleUnfilledSlots(bot){
  return new Promise(function(resolve, reject){
    if(bot.response.result.actionIncomplete){
      bot.send(bot.response.result.fulfillment)
      .then(bot => {
        bot.state.status == 'waiting';
        resolve(bot)
      })
      .catch(err => reject(err))
    } else  {
      resolve(bot)
    }
  })
}

export function getTaskFromResponseAction(bot){
  return new Promise(function(resolve, reject){
    var responseParams = bot.response.result.parameters;
    if(bot.state.status == 'responding'){
      var query = {
        'objective': bot.response.result.action
      }
      Task.find(query)
      .then(tasks => filterByParams(tasks, responseParams))
      .then(tasks => {
        bot.cache.tasks = tasks;
        resolve(bot)
      })
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }

    function filterByParams(tasks, params){
      return new Promise(function(resolve, reject){
        var returned = [];

        tasks.forEach(function(task, t){
          var isValid = checkProperties(task, params);
          if(isValid){
            returned.push(task)
          }
        })

        function checkProperties(task, params){
          var isValid = true;
          if(tasks.params && tasks.params.constructor === Object && Object.keys(params).length > 0){
            for (var param in task.params) {
              if (task.params.hasOwnProperty(property)) {
                if(task.params[property] == params[property] || (task.params[property] === '*' && params[property])){
                  return true
                } else {
                  return false
                }
              }
            }
          } else {
            return true;
          }
        }
        if(returned.length > 0){
          resolve(returned[0]);
        } else {
          resolve(false);
        }

      })
    }
  })
}
