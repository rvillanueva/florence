'use strict';
var Messages = require('../messages');

// Should really be doing this with a db item

var delay = 2500;

var storage = {
  userId: {
    timer: false,
    queue: []
  }
};

function clearTimer(userId){
  clearTimeout(storage[userId].timer);
  storage[userId].timer = null;
}

var sendNext = function(userId){
  if(storage[userId].queue.length > 0){
    var message = storage[userId].queue[0];
    Messages.deliver(message);
    storage[userId].queue.splice(0, 1);
    setTimer(userId);
  } else {
    clearTimer(userId);
  }
}

function setTimer(userId){
  storage[userId].timer = setTimeout(function(){
    sendNext(userId)
  }, delay);
}

function addToQueue(message){
  var userId = message.userId;
  storage[userId].queue.push(message)
  if(!storage[userId].timer){
    sendNext(userId);
  }
}

function setupStorage(userId){
  if(!storage[userId]){
    storage[userId] = {
      timer: null,
      queue: []
    }
  }
  if(!storage[userId].queue){
    storage[userId].queue = [];
  }
}

export function add(message){
  return new Promise(function(resolve, reject){
    setupStorage(message.userId);
    addToQueue(message);
    resolve(message);
  });
}
