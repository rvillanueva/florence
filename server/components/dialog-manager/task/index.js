'use strict';

var TaskService = require('./task.service');

export function run(bot){
  TaskService.executeSend(bot)
  .then(bot => TaskService.handleWait(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}

export function cache(bot){
  return TaskService.cache(bot);
}
