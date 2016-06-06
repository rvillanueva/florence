'use strict';

var Promise = require('bluebird');

// -- GET

export function get(bot){
  return new Promise(function(resolve, reject){
    Task.find()
    .then(tasks => {
      bot.cache.tasks = tasks;
      resolve(bot)
    })
    .catch(err => reject(err))
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

// -- RUN

// Queue sendables from task
export function executeSend(bot){

}

// If task is a question, set status
export function handleWait(bot){

}

// -- RESPOND

// Use cached conversations to return relevant tasks
// INPUT: cache.conversations
// OUTPUT: cache.tasks
export function matchAllByConversations(bot){
  // Return tasks related to current, previous, and topical conversations
  // Otherwise, search global tasks
}

// Rank and select cached tasks based on intent match and slot matches
// INPUT: cache.tasks
// OUTPUT: cache.task
export function matchOne(bot){

}

// Match entities to conversation slots
export function fillSlots(bot){

}

//
export function handleUserInput(bot){

}

//
export function handleClarification(bot){

}

//
export function handleCompletion(bot){

}
