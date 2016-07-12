'use strict';

var Promise = require('bluebird');

var TaskService = require('./task.service');

export function run(bot){
  return new Promise(function(resolve, reject){
    TaskService.executeSend(bot)
    .then(bot => TaskService.executeActions(bot))
    .then(bot => TaskService.updateContext(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))

  })
}

export function cache(bot){
  return TaskService.cache(bot);
}

export function get(bot){
  return new Promise(function(resolve, reject){
    Task.findById(bot.current.taskId).exec()
    .then(task => {
      bot.cache.task = task;
      resolve(task)
    })
    .catch(err => reject(err))
  })
}
