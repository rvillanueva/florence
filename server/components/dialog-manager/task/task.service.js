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

export function getByIds(bot){
  return new Promise(function(resolve, reject){
    Task.find({'_id': {'$in':bot.cache.taskIds}}) //FIXME
    .then(task => {
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

// Use cached conversations to return relevant tasks
// INPUT: features, cache.conversations;
// OUTPUT: cache.tasks
export function searchConversations(bot){
  return new Promise(function(resolve, reject){

  })
}


// Select most relevant task
// INPUT: cache.tasks
// OUTPUT: cache.task
export function selectMostRelevantTask(bot){

}

// Match entities to conversation slots
export function fillSlots(bot){

}

//
export function handleClarification(bot){

}

//
export function handleCompletion(bot){

}
