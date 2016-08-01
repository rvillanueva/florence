'use strict';

var Promise = require('bluebird');

export function addTodo(queue, todo) {
  return new Promise(function(resolve, reject) {
    if (!todo.taskId) {
      reject('Missing taskId.')
    }
    console.log('queue received:')
    console.log(queue)
    queue = queue || [];
    todo.added = new Date();
    var isQueued;

    isQueued = isTaskAlreadyQueued(queue, todo);
    console.log('Is task already queued? ' + isQueued)
    if (!isQueued) {
      if(todo.immediate){
        queue.splice(0,0,todo)
      } else {
        queue.push(todo);
      }
      resolve(queue)
    } else {
      if(todo.immediate){
        queue.splice(0,0,todo)
        for(var i=1;i < queue.length;i++){
          var queued = queue[i];
          if(todo.taskId == queued.taskId){
            queue.splice(i, 1);
            i--;
          }
        }
        console.log('QUEUE IS NOW:')
        console.log(queue)
        resolve(queue);
      } else {
        resolve(false)
      }
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
  console.log('CHECKING QUEUE')
  var found = false;
  queue.forEach(function(queued, q){
    if (queued.taskId == todo.taskId) {
      console.log(queued)
      console.log(todo)
      found = true;
    }
  })
  return found;
}
