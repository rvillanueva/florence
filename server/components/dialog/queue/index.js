'use strict';

var Promise = require('bluebird');

export function addTodo(queue, todo) {

  return new Promise(function(resolve, reject) {
    queue = queue || [];
    if (!todo.taskId) {
      reject('Missing taskId.')
    }

    todo.added = new Date();

    if (!isTaskAlreadyQueued(queue)) {
      queue.push(todo);
      resolve(queue)
    } else {
      resolve(false);
    }
  })

  function isTaskAlreadyQueued(queue) {
    queue.forEach(function(queued, q) {
      if (queued.taskId == todo.taskId) {
        return true
      }
    })
    return false;
  }
}

export function completeTodo(queue, taskId){
  return new Promise((resolve, reject) => {
    var found = false;
    this.queue.forEach((queued, q){
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
