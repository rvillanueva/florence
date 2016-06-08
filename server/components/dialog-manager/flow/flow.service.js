'use strict';

var Promise = require('bluebird');
var TextGenerator = require('../../text-generator')


export function handleTopicChange(bot){
  return new Promise(function(resolve, reject){
    if(isTopicChanging(bot)){
      TextGenerator.addTopicTransition(bot) // bot.sendable, topics
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}

function isTopicChanging(bot){
  return true;
}
