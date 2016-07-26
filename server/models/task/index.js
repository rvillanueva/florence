'use strict';

var Promise = require('bluebird');
import Task from './task.model';

export function attach(entities){
  return new Promise(function(resolve, reject){
    var taskIds = [];
    var taskIndex = {};
    entities = entities || [];
    entities.forEach((entity, e) => {
      if(entity.taskId){
        taskIds.push(entity.taskId)
      }
    })
    Task.find({'_id': {'$in': taskIds}}).exec()
    .then(tasks => {
      tasks.forEach(function(task, t){
        taskIndex[task._id] = task;
      })
      entities.forEach(function(entity, e){
        entity.task = taskIndex[entity.taskId];
      })
      resolve(entities);
    })
    .catch(err => reject(err))

  })
}
