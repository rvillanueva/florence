'use strict';

var Promise = require('bluebird');
var Parser = require('../parser');

var Flow = require('./flow');
var Task = require('./task');
var Notification = require('./notification');
var Strategy = require('./strategy');

var Conversation = require('./strategy/conversation');


// INPUT: received.text
// OUTPUT: received.features, received.attributes
export function handleTextParsing(bot){
  return new Promise(function(resolve, reject){
    if(bot.received.text){
      Parser.classify(bot.received.text)
      .then(features => {
        bot.received.features = features;
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
      Strategy.selectTask(bot)
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
      Strategy.selectTask(bot)
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
