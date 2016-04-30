'use strict';

import * as Conversation from './conversation.service';

export function respond(bot) {
  // look at intent and context and attach appropriate next step as stepId
  // update context
  // should probably set up some DDOS protection here too using a ready to receive flag
  return new Promise(function(resolve, reject){
    Conversation.getStep(bot.state)
    .then(step => Conversation.respondStep(bot, step))
    .then(res => resolve(res))
    .catch(err => reject(err))

  })
}
