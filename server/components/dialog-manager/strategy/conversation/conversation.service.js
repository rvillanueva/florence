'use strict';

var Promise = require('bluebird');
import Conversation from './conversation.model';

// Finds relevant conversations

export function getRelevant(bot){
  return new Promise(function(resolve, reject){
    // TODO Narrow query to most recent
    Conversation.find({'userId': bot.user._id})
    .then(conversations => {
      bot.cache.conversations = conversations || [];
      resolve(bot)
    })
    .catch(err => reject(err))
  })
}

// Apply conversations to score map
// Modifiers: Topic recency, topic adjacency
// INPUT: cache.scores, cache.bids
// OUPUT: cache.scores

export function applyModifiers(bot){
  return new Promise(function(resolve, reject){
    getRelevant(bot)
    .then(bot => applyRecencyScore(bot))
    .then(bot => applyAdjacencyScore(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })


  function applyRecencyScore(bot){
    return new Promise(function(resolve, reject){

    })
  }

  function applyAdjacencyScore(bot){
    return new Promise(function(resolve, reject){

    })
  }
}
