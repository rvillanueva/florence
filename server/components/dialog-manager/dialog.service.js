'use strict';

var Promise = require('bluebird');

var Task = require('./task');
var Notification = require('./notification');
var Strategy = require('./strategy');

var Response = require('../response')

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function logMessage(bot){
  return new Promise(function(resolve, reject){
    Message.receive(bot.received)
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function getResponse(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.status == 'waiting'){
      if(!bot.received.text ){
        reject('No text provided.')
      }
      var params = {
        text: bot.received.text,
        userId: bot.userId,
        agentId: '0' //FIXME with custom bot id
      }
      Response.query(params)
      .then(response => {
        bot.response = response;
        resolve(bot);
      })
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function handleResponse(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.status == 'waiting'){
      Strategy.selectResponse(bot)
      .then(bot => handleResponseError(bot))
      .then(bot => handleTaskExecution(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function handleNextTask(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.status == 'ready'){
      Strategy.selectNext(bot)
      .then(bot => Task.run(bot))
      .then(bot => handleNextTask(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function handleNotification(bot){
  return Notification.notify(bot)
}

export function handleResponseError(bot){
  return new Promise(function(resolve, reject){
    if(!bot.cache.task){
      bot.state.status = 'waiting';
      bot.send({
        text: 'Uh oh, it looks like there was a problem. I\'ve reported it and we\'ll get back to you shortly.'
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function handleTaskExecution(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.status == 'responding'){
      Task.run(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}
