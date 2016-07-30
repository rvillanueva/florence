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


export function query(query) {
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
      console.log('Searching among tasks:');
      console.log(tasks);
      return new Promise(function(resolve, reject) {
        tasks = tasks || [];
        for (var i = 0; i < tasks.length; i++) {
          var task = tasks[i];
          if (queryIsMissingParams(task) || queryIsMissingAttributes(task)) {
            tasks.splice(i, 1);
            i--;
          }
        }
        console.log('Filtered:');
        console.log(tasks);
        resolve(tasks)
      })
    }

    function queryIsMissingParams(task) {
      var response = false;
      for (var param in task.params) {
        if (task.params.hasOwnProperty(param)) {
          if(!query.params[param]){
            response = true;
          }
        }
      }
      return response;
    }

    function queryIsMissingAttributes(task) {
      var response = false;
      for (var attribute in task.attributes) {
        if (task.attributes.hasOwnProperty(attribute)) {
          if (!query.params[attribute] || query.params[attribute] !== task.attributes[attribute]) {
            response = true;
          }
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
        if(selected){
          console.log('Best task selected:')
          console.log(selected);
        } else {
          console.log('No task found.')
        }
        resolve(selected);
      })
    }
  })
}
