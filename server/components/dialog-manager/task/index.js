'use strict';

var Promise = require('bluebird');

var TaskService = require('./task.service');

export function run(bot){
  return new Promise(function(resolve, reject){
    TaskService.handleLoop(bot)
    .then(bot => TaskService.executeSend(bot))
    .then(bot => TaskService.handleWait(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))

  })
}

export function cache(bot){
  return TaskService.cache(bot);
}
