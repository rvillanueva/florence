'use strict';

var Promise = require('bluebird');
import Task from '../../../models/task/task.model';
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

export function getById(taskId){
  return new Promise(function(resolve, reject){
    Task.findById(taskId).exec()
    .then(task => resolve(task))
    .catch(err => reject(err))
  })
}
