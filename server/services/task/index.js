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
      }).lean().exec()
      .then(tasks => filterByParams(tasks))
      .then(tasks => selectMostSpecificTask(tasks))
      .then(task => replaceParams(task))
      .then(task => resolve(task))
      .catch(err => reject(err))

    function filterByParams(tasks) {
      return new Promise(function(resolve, reject) {
        tasks = tasks || [];
        for (var i = 0; i < tasks.length; i++) {
          var task = tasks[i];
          if (queryIsMissingParams(task) || queryIsMissingAttributes(task)) {
            tasks.splice(i, 1);
            i--;
          }
        }
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
        var selected = [];
        var currentNumMatches = false;
        tasks.forEach(function(task, t){
          task.attributes = task.attributes || {};
          task.params = task.params || {};
          var thisNumMatches = hasMoreMatchedParams(task, currentNumMatches);
          if(selected.length == 0 || thisNumMatches == currentNumMatches){
            selected.push(task);
            currentNumMatches = thisNumMatches;
          } else if(thisNumMatches !== false){
            selected = [];
            selected.push(task);
            currentNumMatches = thisNumMatches;
          }
        })
        if(selected.length > 0){
          resolve(selected[Math.floor(Math.random() * selected.length)]);
        } else {
          console.log('ERROR: No task found.')
          resolve(false);
        }
      })

      function hasMoreMatchedParams(task, comparisonNumber){
        var numberMatched = Object.keys(task.attributes).length + Object.keys(task.params).length;
        if(
          comparisonNumber === false ||
          numberMatched > comparisonNumber
        ){
          return numberMatched;
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
