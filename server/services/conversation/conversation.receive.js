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
    Refs.getSteps(bot)
    .then(bot => Load.intent(bot))
    .then(bot => Load.finalize(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
