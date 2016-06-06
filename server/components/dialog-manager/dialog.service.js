'use strict';

var Promise = require('bluebird');
var Flow = require('./flow');
var Task = require('./task');
var Notification = require('./notification');
var Conversation = require('./conversation');
var Strategy = require('./strategy');

export function handleTaskResponse(bot){
  return new Promise(function(resolve, reject){
    // TODO add in permissions handling
    if(bot.state.status == 'waiting'){
      Conversation.getRelevant(bot)
      .then(bot => Task.matchAllByConversations(bot))
      .then(bot => Task.makeResponseBid(bot))
      .then(bot => Strategy.selectTask(bot))
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
