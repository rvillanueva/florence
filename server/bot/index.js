'use strict';

var Promise = require("bluebird");
var Bot = require('./bot.model').constructor;
var Interpret = require('../services/interpreter');
var Conversation = require('../services/conversation');

export function respond(message){
  return new Promise(function(resolve, reject){
    console.log(message)
    var bot = new Bot(message);
    bot.init()
    .then(bot => Conversation.receive(bot))
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
