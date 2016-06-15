'use strict';

var Promise = require('bluebird');
var Task = require('../task');

var Response = require('./response');
var Rule = require('./rule');
var Bid = require('./bid');
var Conversation = require('./conversation');

export function getAllTasks(bot){
  Task.getByType(bot)
  .then(bot => Task.buildIndex(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}

// If a response, handle bid creation and task filtering
export function getResponseTasks(bot) {
  return new Promise(function(resolve, reject) {
    Task.getByType(bot)
    .then(bot => Task.buildIndex(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

// Initialize score map and task index
// INPUT: cache.tasks
// OUTPUT: cache.scores
export function initScoreMap(bot) {
  return new Promise(function(resolve, reject) {
    Task.get(bot)
    .then(bot => Task.buildIndex(bot))
    .then(bot => {
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
    .catch(err => reject(err))
  })
}

export function applyNextTaskScoring(bot){
  return new Promise(function(resolve, reject){
    // When responding to a user input
      Conversation.applyToScores(bot)
      .then(bot => Rule.applyToScores(bot))
      .then(bot => Bid.applyToScores(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function applyResponseScoring(bot){
  return new Promise(function(resolve, reject){
    // Do response bids
    // Score based on conversation recency
    // Score based on slot matching
    Response.createBids(bot)
      .then(bot => Bid.applyToScores(bot))
      .then(bot => Conversation.applyToScores(bot))
      .then(bot => Task.applyToScores(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}



// Select best task based on scores
// INPUT: cache.scores, cache.taskMap
// OUTPUT: cache.task
export function selectBestTask(bot) {
  return new Promise(function(resolve, reject) {

    if (bot.cache.scores.length == 0) {
      bot.cache.task = null;
      resolve(bot);
    } else {

      // Sort score map by score
      bot.cache.scores.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      // Sort score map by forced = true
      bot.cache.scores.sort(function(a, b) {
        if(a.force && !b.force){
          return 1;
        } else if(!a.force && b.force){
          return -1;
        } else {
          return 0;
        }
      });

      // Select best
      bot.cache.task = bot.cache.taskMap[bot.cache.scores[0].taskId]

      // Return associated task
      resolve(bot);
    }
  })
}

// Update conversation
// INPUT: cache.task
export function updateConversation(bot) {
  return new Promise(function(resolve, reject) {
  })
}
