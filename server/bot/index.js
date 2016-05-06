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
    .then(bot => {
      console.log(bot)
      bot.state.status = 'receiving';
      Conversation.run(bot)
    })
    .catch(err => reject(err))
  })
}
