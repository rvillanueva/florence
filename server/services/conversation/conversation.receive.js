'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');
var Conversation = require('../../api/conversation/conversation.service');
var Refs = require('./conversation.refs');
var Checkup = require('../checkup');
var Load = require('./conversation.load');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    var intents;
    Interpreter.getEntities(bot)
    .then(bot => Interpreter.getIntents(bot))
    .then(bot => receiveByType(bot))
    .then(bot => handleGlobalIntent(bot))
    .then(bot => handleConfusion(bot))
    .then(bot => Load.set(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function receiveByType(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.current.type == 'step'){
      receiveConversation(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else if(bot.state.current.type == 'checkup'){
      receiveCheckup(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      reject(new TypeError('Unrecognized current loadable type ' + bot.state.current.type));
    }
  })
}

function receiveConversation(bot){
  return new Promise(function(resolve, reject){
    Refs.getSteps(bot)
    .then(bot => Load.intentStep(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function receiveCheckup(bot){
  return new Promise(function(resolve, reject){
    Checkup.receive(bot)
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function handleGlobalIntent(bot){
  return new Promise(function(resolve, reject){
    console.log('Handling global intent...')
    var globalIntents = [];
    if(bot.loaded.next && !bot.loaded.next.fallback){
      resolve(bot)
    } else {
      bot.cache.intents.forEach(function(intent, i) {
        if (intent.global && intent.conversationId) {
          globalIntents.push(intent);
        }
      })
      if(globalIntents.length > 0){
        Conversation.getById(globalIntents[0].conversationId)
          .then(convo => {
            bot.loaded.conversation = convo;
            bot.loaded.next = {
              type: 'diversion',
              stepId: convo.next[0].stepId
            }
            resolve(bot)
          })
          .catch(err => reject(err))
      } else {
        resolve(bot);
      }
    }
  })
}

function handleConfusion(bot){
  return new Promise(function(resolve, reject){
    console.log('Handling any confusion...')
    if(bot.loaded.next){
      resolve(bot)
    } else {
      if(bot.state.status == 'receiving'){
        bot.loaded.next = {
          type: 'confused'
        }
      } else {
        bot.loaded.next = {
          type: 'next'
        }
      }
      resolve(bot)
    }
  })
}
