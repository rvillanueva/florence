'use strict';

var Promise = require('bluebird');
var Message = require('../message');

var Task = require('./task');
var Notification = require('./notification');
var Strategy = require('./strategy');
var Bid = require('./strategy/bid');

var Response = require('../response');

var maxLoops = 5;

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
// OUTPUT: response
export function getCurrentTask(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.status == 'waiting'){  // TODO applying this logic will prevent processing multiple responses
      if(!bot.received.text){
        reject(new TypeError('No text provided.'))
      }
      var params = {
        text: bot.received.text,
        sessionId: bot.user._id
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
      console.log('responding')
      bot.state.status = 'responding';
      Strategy.selectResponse(bot)
      .then(bot => handleConfusion(bot))
      .then(bot => setStatusToReady(bot))
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
      bot.loops = bot.loops || 0;
      console.log('\n\n\n\n\n\n')
      console.log('Loop #' + bot.loops);
      Strategy.selectNext(bot)
      .then(bot => handleNoTask(bot))
      .then(bot => handleTaskExecution(bot))
      .then(bot => handleNextTask(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      bot.update()
      .then(bot => {
        console.log('\n\n\n\n\n\n\n-----DONE-----\n\n\n\n\n\n\n')
        resolve(bot)
      })
      .catch(err => reject(err))
    }
  })
}

export function handleNotification(bot){
  return Notification.notify(bot)
}

export function handleConfusion(bot){
  return new Promise(function(resolve, reject){
    if(!bot.cache.task){
      console.log('ERROR: No appropriate task found based on response')
      bot.state.status = 'waiting';
      bot.send({
        text: 'Sorry, I didn\'t quite understand that!\n\nI\'m having someone look into it, but in the meantime let me know if you have anything else.'
      })
      .then(() => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function handleNoTask(bot){
  return new Promise(function(resolve, reject){
    if(!bot.cache.task){
      bot.state.status = 'waiting';
      bot.send({
        text: 'Great! That\'s all I have for now. Let me know if you have any questions.'
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
    if(bot.state.status == 'ready'){
      Task.run(bot)
      .then(bot => Bid.fulfillFromTask(bot))
      .then(bot => handleWait(bot))
      .then(bot => handleLoop(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

// If task is a question, set status
// INPUT: cache.task
export function handleWait(bot){
  return new Promise(function(resolve, reject){
    if(bot.cache.task.type == 'ask'){
      bot.state.status = 'waiting';
    }
    resolve(bot);

  })
}

export function handleLoop(bot){
  return new Promise(function(resolve, reject){
    bot.loops++;
    if(bot.loops > maxLoops){
      bot.state.status = 'waiting';
      console.log('TIMED OUT: Too many loops.');
    }
    resolve(bot);
  })
}

export function setStatusToReady(bot){
  return new Promise(function(resolve, reject){
    bot.state.status = 'ready';
    resolve(bot);
  })
}
