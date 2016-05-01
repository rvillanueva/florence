'use strict';

import * as ConversationService from './conversation.service';

export function run(bot) {
  // look at intent and context and attach appropriate next step as stepId
  // update context
  // should probably set up some DDOS protection here too using a ready to receive flag
  return new Promise(function(resolve, reject){
    ConversationService.run(bot)
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
