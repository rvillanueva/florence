'use strict';

var Promise = require("bluebird");
var Bot = require('./bot.model').constructor;
var Interpret = require('../services/interpreter');
var Conversation = require('../services/conversation');

export function respond(message){
  return new Promise(function(resolve, reject){
    var bot = new Bot(message)
    bot.getState()
    .then(bot => Interpret.getEntities(bot))
    .then(bot => Conversation.respond(bot))
    .catch(err => reject(err))
  })
}
