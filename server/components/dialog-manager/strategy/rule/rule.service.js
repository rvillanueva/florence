'use strict';

var Promise = require('bluebird');

// Cycle through each score in map and update it
// INPUT: cache.scores
// OUTPUT: cache.scores

export function scoreTasks(bot){
  return new Promise(function(resolve, reject){
    var i = 0;
    score(bot);

    function score(bot){
      if(i >= bot.cache.tasks.length - 1){
        resolve(bot);
      } else {
        i++;
        bot.cache.task = bot.cache.tasks[i];
        RulesService.scoreTask(bot)
        .then(bot => score(bot))
        .catch(err => reject(err))
      }
    }
  })
}

// Score an individual task
// INPUT: cache.task
// OUTPUT: cache.score
export function scoreTask(bot, task){
  return new Promise(function(resolve, reject){
    SocialRules.applyAll(bot)
    .then(bot => addScoreToMap(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
