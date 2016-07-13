'use strict';

var Promise = require('bluebird');

export function addTodo(queue, taskId, options) {

  return new Promise(function(resolve, reject) {
    if (!taskId) {
      reject('Missing taskId.')
    }
    queue = queue || [];
    options = options || {};
    var isQueued;
    var todo = {
      taskId: taskId,
      added: new Date()
    }

    if(options.forced){
      todo.forced = true;
    }

    isQueued = isTaskAlreadyQueued(queue, todo);

    if (isQueued === false) {
      if(options.forced){
        queue.splice(0,0,todo)
      } else {
        queue.push(todo);
      }
      resolve(queue)
    } else {
      // Handle popping existing task
      resolve(false);
    }
  })
}

export function completeTodo(queue, taskId){
  return new Promise((resolve, reject) => {
    var found = false;
    this.queue.forEach((queued, q) => {
      if(queued.taskId == taskId){
        // TODO log completion before deletion
        queued.splice(q,1);
        found = true;
      }
    })

    if(found){
      resolve(queued)
    } else {
      reject('Task with id ' + taskId + ' not found in queue.')
    }
  })
}



function isTaskAlreadyQueued(queue, todo) {
  queue.forEach(function(queued, q) {
    if (queued.taskId == todo.taskId) {
      return q;
    }
  })
  return false;
}
