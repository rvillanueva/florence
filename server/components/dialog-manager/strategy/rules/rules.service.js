'use strict';

var Promise = require('bluebird');

// Cycle through each task and score it
// INPUT: cache.tasks, cache.scores
// OUTPUT: cache.scores

export function scoreTasks(bot){
  return new Promise(function(resolve, reject){
    var i = 0;
    score(bot);

    function score(bot){
      if(i >= bot.cache.tasks.length - 1){
        resolve(bot);cd
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

// Start a new score map
// INPUT: none
// OUTPUT: cache.scores
export function initMap(bot){
  bot.cache.scores = [];
}

// Add a score to the reward map
// INPUT: cache.score, cache.scores
// OUTPUT: cache.scores
export function addScoreToMap(bot){
  bot.cache.scores.push(bot.cache.score);
}
