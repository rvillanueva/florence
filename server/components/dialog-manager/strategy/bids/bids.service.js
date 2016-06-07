'use strict';

var Promise = require('bluebird');

// Apply each bid to the score map
// INPUT: cache.scores, cache.bids
// OUPUT: cache.scores

export function applyEachBid(bot){
  return new Promise(function(resolve, reject){
    for(var i = 0; i < bot.cache.bids.length; i ++){
      var bid = bot.cache.bids[i];
      for (var j = 0; j < bot.cache.scores.length; j++){
        var score = bot.cache.scores[j];
        // needs to match bid attributes with task attributes
      }
    }
    resolve(bot)
  })
}
