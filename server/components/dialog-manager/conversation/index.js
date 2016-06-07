'use strict';

import Conversation from './conversation.model';

export function update(bot){

}

export function getRelevant(bot){
  return new Promise(function(resolve, reject){
    // TODO Narrow query to most recent
    Conversation.find({'userId': bot.userId})
    .then(conversations => {
      bot.cache.conversations = conversations;
      resolve(bot)
    })
    .catch(err => reject(err))
  })
}
