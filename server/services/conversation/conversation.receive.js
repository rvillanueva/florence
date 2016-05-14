'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');
var Sort = require('./conversation.sort');
var Conversation = require('../../api/conversation/conversation.service');
var Refs = require('./conversation.refs');
var Checkup = require('../checkup');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    var intents;
    Interpreter.getEntities(bot)
    .then(bot => Interpreter.getIntents(bot))
    .then(bot => {
      if(bot.state.checkup && bot.state.checkup.active){
        return Checkup.receive(bot);
      } else {
        return conversationReceive(bot);
      }
    })
    .then(bot => resolve(bot))
    .catch(err => reject(err))

  })
}

function conversationReceive(bot){
  return new Promise(function(resolve, reject){
    Refs.get(bot)
    .then(bot => Refs.filterByCondition(bot))
    .then(bot => Refs.convertToSteps(bot))
    .then(bot => Sort.stepsByType(bot))
    .then(bot => Sort.byIntentType(bot))
    .then(bot => load(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function load(bot){
  return new Promise(function(resolve, reject){
    console.log('Loading step...')

    // TODO what if there are more than one matched step?
    if(bot.cache.sortedIntents.matched.length > 0){
      bot.state.status = 'conversing';
      bot.setStep(bot.cache.sortedIntents.matched[0]._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))

      // Otherwise, if a global intent matches, divert. TODO only do this if urgent
    } else if (bot.cache.sortedIntents.global.length > 0){
      bot.state.status = 'conversing';
      Conversation.getById(bot.cache.sortedIntents.global[0].conversationId)
      .then(convo => bot.divert(convo))
      .then(bot => resolve(bot))
      .catch(err => reject(err))

      // Otherwise, use fallback
    } else if (bot.cache.sortedIntents.fallback.length > 0){
      bot.state.status = 'conversing';
      bot.setStep(bot.cache.sortedIntents.fallback[0]._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))

      // Otherwise be confused
    } else {
      bot.state.status = 'waiting';
      bot.confused()
      .then(() => resolve(bot))
      .catch(err => reject(err))

    }
  })
}
