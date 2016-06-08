'use strict';

var Promise = require('bluebird');
var Parser = require('../parser');

var Flow = require('./flow');
var Task = require('./task');
var Notification = require('./notification');
var Conversation = require('./conversation');
var Strategy = require('./strategy');


// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function handleTextParsing(bot){
  return new Promise(function(resolve, reject){
    if(bot.received.text){
      Parser.classify(bot.received.text)
      .then(entities => {
        bot.received.entities = entities;
        resolve(bot);
      })
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

export function handleTaskResponse(bot){
  return new Promise(function(resolve, reject){
    // TODO add in permissions handling
    if(bot.state.status == 'waiting'){
      Strategy.selectTaskForResponse(bot)
      .then(bot => Task.respond(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot);
    }
  })
}

export function handleNextTask(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.status == 'ready'){
      Strategy.selectTaskToRun(bot)
      .then(bot => Conversation.update(bot))
      //.then(bot => Flow.handleTopicChange(bot))
      //.then(bot => Flow.handleAskPermission(bot))
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
