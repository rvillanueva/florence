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
    console.log('\n\nQUERY IS:')
    console.log(query);
    console.log(query.objective)
    Task.find({
        'objective': query.objective
      }).lean().exec()
      .then(tasks => filterByParams(tasks))
      .then(tasks => selectMostSpecificTask(tasks))
      .then(task => replaceParams(task))
      .then(task => resolve(task))
      .catch(err => reject(err))

    function filterByParams(tasks) {
      return new Promise(function(resolve, reject) {
        console.log('Filtering...')
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

    function selectMostSpecificTask(tasks){
      return new Promise(function(resolve, reject) {
        var selected = false;
        tasks.forEach(function(task, t){
          task.attributes = task.attributes || {};
          task.params = task.params || {};
          if(!selected || isMoreSpecific(task, selected)){
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

      function isMoreSpecific(newTask, oldTask){
        if(
          (Object.keys(newTask.attributes).length + Object.keys(newTask.params).length) >
          (Object.keys(oldTask.attributes).length + Object.keys(oldTask.params).length)
        ){
          return true;
        } else {
          return false;
        }
      }
    }

    function replaceParams(task){
      return new Promise(function(resolve, reject){
        task.raw = task.text;
        task.text = transformText(task.text, query.params)
        resolve(task)
      })
    }

    function transformText(text, params){
      var loops = 0;
      for(var param in params){
        if (params.hasOwnProperty(param) && typeof params[param] == 'string') {
          while(text.indexOf('<<' + param + '>>') > -1 && loops < 5){
            var term = params[param];
            var location = text.indexOf('<<' + param + '>>');
            var start = text.slice(0, location);
            var end = text.slice((location + param.length + 4), text.length);
            var transformedTerm;

            // TODO - make generalizable framework to turn lowercase instead of manually defining params

            text = start + term + end;
            loops ++;
            if(loops == 5){
              // You screwed up
              console.log('ERROR: LOOPING TO REPLACE PARAMS OVERFLOWED FOR TERM ' + term)
            }
          }
        }
      }
      return text;
    }


  })
}
