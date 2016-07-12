'use strict';

var Promise = require('bluebird');
var TaskService = require('../task')
import Task from '../../../models/task/task.model';

// Select best task based on scores
// INPUT: cache.tasks
// OUTPUT: cache.task
export function selectTopTask(bot) {
  return new Promise(function(resolve, reject) {

      if (bot.cache.tasks.length == 0) {
        bot.cache.task = null;
        resolve(bot);
      } else {

        // Sort score map by score and force
        bot.cache.tasks.sort(function(a, b) {

            var forceCheck = isForced();
            var scoreCheck = isHigher();

            if (forceCheck) {
              return forceCheck;
            } else {
              return scoreCheck;
            }

            function isForced() {
              if (a.force == true && !b.force) {
                return -1;
              } else if (!a.force && b.force == true) {
                return 1;
              } else {
                return 0;
              }
            }

            function isHigher() {
              return parseFloat(b.score) - parseFloat(a.score);
            }


          })


      // Select best
      var selected = bot.cache.tasks[0]
      if (selected.score > 0 || selected.force) {
        bot.cache.task = selected;
      } else {
        bot.cache.task = null;
      }

      console.log('TOP:')
      console.log(selected)
      console.log('\n')


      // LOG
      console.log('SELECTED:')
      console.log(bot.cache.task)
      console.log('\n\n')
      console.log('TASK SCORE MAP');
      bot.cache.tasks.forEach(function(task, t) {
        var str = '(' + task.score + ') ' + task.objective;
        if (task.force) {
          str += ' - FORCED'
        }
        console.log(str)
      })
      console.log('\n\n\n')
        // Return associated task
      resolve(bot);
    }
  })
}


// RESPONSE HANDLING


export function handleUnfilledSlots(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.response.result.actionIncomplete) {
      bot.send(bot.response.result.fulfillment.speech)
        .then(bot => {
          bot.state.status == 'waiting';
          resolve(bot)
        })
        .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function getTaskFromResponseAction(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'responding') {
      var responseParams = bot.response.result.parameters;
      var query = {
          'objective': bot.response.result.action,
          type: 'respond'
        }
        // TODO just find one
      Task.find({
          'objective': bot.response.result.action,
          'type': 'respond'
        }).exec()
        .then(tasks => filterByParams(tasks, responseParams))
        .then(task => {
          if (task) {
            console.log('FOUND RESPONSE TASK:')
            console.log(task)
            bot.cache.task = task;
          } else {
            console.log('NO RESPONSE TASK FOUND')
            bot.cache.task = null;
          }
          resolve(bot)
        })
        .catch(err => reject(err))
    } else {
      resolve(bot)
    }

    function filterByParams(tasks, responseParams) {
      return new Promise(function(resolve, reject) {
        var returned = [];

        tasks.forEach(function(task, t) {
          var paramsMatched = responseMatchesAllTaskParams(task, responseParams)
          if (paramsMatched !== false) {
            task.score = paramsMatched;
            returned.push(task)
          }
        })

        function responseMatchesAllTaskParams(task, responseParams) {
          var isValid = true;
          var paramsMatched = 0;
          if (task.params) {
            for (var taskParam in task.params) {
              if (task.params.hasOwnProperty(taskParam)) {
                if (valueMatch() || wildcardMatch()) {
                  paramsMatched ++;
                } else {
                  isValid = false;
                }

                function valueMatch() {
                  if (responseParams[taskParam] == task.params[taskParam]) {
                    return true
                  } else {
                    return false
                  }
                }

                function wildcardMatch() {
                  if (task.params[taskParam] === '*' && responseParams[taskParam]) {
                    return true;
                  } else {
                    return false
                  }
                }
              }
            }
          }
          if(isValid){
            return paramsMatched;
          } else {
            return false;
          }
        }

        if(returned.length > 1){
          console.log(returned.length + ' matched responses.')

          returned.sort(function(a, b){
            return parseFloat(b.score) - parseFloat(a.score);
          })
        }

        if (returned.length > 0) {
          resolve(returned[0]);
        } else {
          resolve(false);
        }

      })
    }
  })
}