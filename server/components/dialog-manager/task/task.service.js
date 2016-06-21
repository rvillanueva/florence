'use strict';

var Promise = require('bluebird');
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

    // TODO Use text-generator to split say

    if(task.say){
      messages = [
        {
          type: 'text',
          text: say
        }
      ]
    }
    if(task.attachments && task.attachments.length > 0){
      attachments = task.attachments;
    }

    sendables.concat(messages);
    sendables.concat(attachments);

    sendables.forEach(function(sendable, s){
      promises.push(bot.send(sendable))
    })

    Promise.all(promises)
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

// If task is a question, set status
// INPUT: cache.task
export function handleWait(bot){
  return new Promise(function(resolve, reject){
    if(bot.cache.task.type == 'ask'){
      bot.state.status = 'waiting';
      bot.update()
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot);
    }
  })
}


// CRUD

export function cache(bot){
  return new Promise(function(resolve, reject){
    Task.find().lean().exec()
    .then(tasks => {
      bot.cache.tasks = tasks;
      resolve(bot)
    }
    .catch(err => reject(err))
  })
}
