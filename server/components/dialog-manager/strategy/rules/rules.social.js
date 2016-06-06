'use strict';

var Promise = require('bluebird');

export function applyAll(bot){
  return new Promise(function(resolve, reject){
    topicChange(bot)
    .then(bot => introduction(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

// -- RULES
// INPUT: cache.task
// OUTPUT: cache.score

// If a topic requires a topic switch, lose points
function topicChange(bot){
  return new Promise(function(resolve, reject){
    resolve(bot);
  })
}

// If bot hasn't introduced itself yet, run introduction
function introduction(bot){
  return new Promise(function(resolve, reject){
    if(!bot.state.hello && bot.cache.task.task == 'hello'){
      bot.cache.score += 50;
    }
    resolve(bot);
  })
}
