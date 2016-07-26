'use strict';

var Promise = require('bluebird');

export function addTask(queue, taskId, options) {
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
    console.log('Removing taskId: ' + taskId)
    console.log('Queue was:')
    console.log(queue)
    var found = false;
    queue = queue || [];
    for(var i=0; i < queue.length; i++){
      var queued = queue[i];
      if(queued.taskId == taskId){
        console.log('found taskId at position ' + i)
        // TODO log completion before deletion
        queue.splice(i,1);
        found = true;
        console.log('spliced, now')
        console.log(queue)
        i--;
      }
    }
    if(found){
      console.log('Found and removed todo, queue is now:')
      console.log(queue)
      resolve(queue)
    } else {
      reject(new Error('Task with id ' + taskId + ' not found in queue.'))
    }
  })
}



function isTaskAlreadyQueued(queue, todo){
  queue.forEach(function(queued, q) {
    if (queued.taskId == todo.taskId) {
      return q;
    }
  })
  return false;
}
