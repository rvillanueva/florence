'use strict';

var Promise = require('bluebird');

// Initialize score map and task index
// INPUT: cache.tasks
// OUTPUT: cache.scores
export function initScoreMap(bot) {
  return new Promise(function(resolve, reject) {
    bot.cache.scores = [];
    // Push a score holder referencing each task
    bot.cache.tasks.forEach(function(task, t) {
      var score = {
        taskId: task._id
      }
      bot.cache.scores.push(score);
    })
    resolve(bot);
  })
}

// Select best task based on scores
// INPUT: cache.scores, cache.taskMap
// OUTPUT: cache.task
export function selectBestTask(bot) {
  return new Promise(function(resolve, reject) {

    if (bot.cache.scores.length == 0) {
      bot.cache.task = null;
    } else {

      // Sort score map by score
      bot.cache.scores.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      // Select best
      bot.cache.task = bot.cache.taskMap[bot.cache.scores[0].taskId]

      // Return associated task
      resolve(bot)
    }
  })
}
