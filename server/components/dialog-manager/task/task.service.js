'use strict';

var Promise = require('bluebird');
var Action = require('../action');
var Response = require('../../response');
import Task from './task.model';
// -- RUN

// Queue sendables from task
// INPUT: cache.task, cache.task.send
export function executeSend(bot){
  return new Promise(function(resolve, reject){
    var promises = [];
    var sendables = [];
    var messages = [];
    var attachments = [];
    var task = bot.cache.task;

    console.log('Running task ' + task._id + ': ' + task.objective)

    // TODO Use text-generator to split say


    if(task.say){
      messages = [
        {
          type: 'text',
          text: task.say
        }
      ]
    }
    if(task.attachments && task.attachments.length > 0){
      attachments = task.attachments;
    }

    sendables = sendables.concat(messages);
    sendables = sendables.concat(attachments);
    sendables.forEach(function(sendable, s){
      promises.push(bot.send(sendable))
    })

    Promise.all(promises)
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function executeActions(bot){
  return Action.execute(bot);
}

export function updateContext(bot){
  return new Promise(function(resolve, reject){
    if(bot.cache.task.type == 'ask'){
      var request = {
        sessionId: bot.user._id,
        contexts: [{
          name: bot.cache.task.objective,
          params: []
        }]
      }
      var params = bot.cache.task.params;

      if(params){
        for (var param in params){
          if (params.hasOwnProperty(param)) {
              var paramPair = {
                name: param,
                value: params[param]
              }
              request.context.params.push(paramPair)
          }
        }
      }
      Response.addContexts(request)
      .then(() => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

// CRUD

export function cache(bot){
  return new Promise(function(resolve, reject){
    Task.find({'type': {'$in': ['say','ask']}}).lean().exec()
    .then(tasks => {
      bot.cache.tasks = tasks;
      resolve(bot)
    })
    .catch(err => reject(err))
  })
}
