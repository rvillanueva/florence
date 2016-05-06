'use strict';
var Promise = require('bluebird');

export function divertByIntent(){
  return new Promise(function(resolve, reject){
    Conversation.getByIntent(bot.state.received.intent)
      .then(convo => {
        if (!convo) {
          reject('No convo found for intent.')
        }
        bot.ref = {
          type: 'conversation',
          refId: convo._id
        };
        bot.conversation = convo;
        bot.state.status = 'executing';
        resolve(bot);
      })
      .catch(err => reject(err))
  })
}
