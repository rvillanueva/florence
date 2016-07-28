'use strict';

import Task from '../../models/task/task.model';

var Promise = require('bluebird');


export function getById(taskId) {
  return new Promise(function(resolve, reject) {
    Task.findById(taskId).lean().exec()
      .then(task => resolve(task))
      .catch(err => reject(err))
  })
}


export function search(query) {
  return new Promise(function(resolve, reject) {
    if (!query.objective) {
      reject(new Error('Need to define objective in query.'))
    }
    Task.find({
        'objective': query.objective
      })
      .then(tasks => filterByParams(tasks))
      .then(tasks => selectBestTask(tasks))
      .then(task => resolve(task))
      .catch(err => reject(err))

    function filterByParams(tasks) {
      return new Promise(function(resolve, reject) {
        tasks = tasks || [];
        for (var i = 0; i < tasks.length; i++) {
          if (queryIsMissingParams(task) || queryIsMissingAttribute(task)) {
            tasks.splice(i, 1);
            i--;
          }
        }
        resolve(tasks)
      })
    }

    function queryIsMissingParams(task) {
      var response = false;
      for (param in task.params) {
        //if hasownproperty
        if (!query.params[param]) {
          response = true;
        }
      }
      return response;
    }

    function queryIsMissingAttribute(task) {
      var response = false;
      for (attribute in task.attributes) {
        //if hasownproperty
        if (!query.params[attribute] || query.params[attribute] !== task.attributes[attribute]) {
          response = true;
        }
      }
      return response;
    }

    function selectBestTask(tasks){
      return new Promise(function(resolve, reject) {
        var selected = false;
        tasks.forEach(function(task, t){
          task.params = task.params || {};
          if(!selected || Object.keys(task.params).length > Object.keys(selected.params).length){
            selected = task;
          }
        })
        resolve(task);
      })
    }
  })
}
