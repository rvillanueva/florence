'use strict';

import Task from '../../models/task/task.model';
import Question from '../../models/question/question.model';

var Promise = require('bluebird');


export function getById(taskId){
  return new Promise(function(resolve, reject){
    Task.findById(taskId).lean().exec()
    .then(task => resolve(task))
    .catch(err => reject(err))
  })
}


export function search(params){
  return new Promise(function(resolve, reject){
  })
}
