'use strict';

var Promise = require('bluebird');

// -- GET

// OUPUT: cache.tasks
export function get(bot){
  return new Promise(function(resolve, reject){
    if(!bot.cache.tasks){
      Task.find()
      .then(tasks => {
        bot.cache.tasks = tasks;
        resolve(bot)
      })
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function getById(bot){
  return new Promise(function(resolve, reject){
    Task.findById(bot.cache.taskId)
    .then(task => {
      bot.cache.task = task;
      resolve(bot)
    })
    .catch(err => reject(err))
  })
}

// INPUT: cache.taskTypes
// OUTPUT: cahce.tasks
export function getByTypes(bot){
  return new Promise(function(resolve, reject){
    Task.find({'type': {'$in':bot.cache.taskTypes}}) //FIXME
    .then(tasks => {
      bot.cache.tasks = tasks;
      resolve(bot)
    })
    .catch(err => reject(err))
  })
}

export function buildIndex(bot){
  return new Promise(function(resolve, reject){
    if(!bot.cache.taskMap){
      bot.cache.taskMap = {};
      bot.cache.tasks.forEach(function(task, t){
        bot.cache.taskMap[task._id] = task;
      })
      resolve(bot)
    } else {
      resolve(bot)
    }
  })
}

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

// -- RESPOND

// Match entities to conversation slots
export function fillSlots(bot){
  return new Promise(function(resolve, reject){
    bot.cache.unfilledSlots = [];
    bot.cache.slots = bot.cache.task.slots || [];
    bot.cache.slots.forEach(function(slot, s){
      var entitiyValue = bot.cache.received.entities[slot.feature];
      if(entityValue){
        slot.value == entityValue;
      } else {
        bot.cache.taskCompleted = false;
      }
    })
  })
}

// Check if all required slots are filled and then execute action
export function handleCompletion(bot){
  if(bot.cache.taskCompleted == true){
    // TODO execute action;
    bot.state.status == 'ready';
    if(bot.cache.task.confirmations && bot.cache.task.confirmations.completed){
      bot.send([{
        text: bot.cache.task.confirmations.completed
      }])
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  } else {
    resolve(bot);
  }
}

//
export function handleClarification(bot){

}

export function applyToScores(bot){
  return new Promise(function(resolve, reject){
    // Cycle through each task and add scores from response

  })
}
