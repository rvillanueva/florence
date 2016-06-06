'use strict';

var Promise = require('bluebird');
var Bid = require('../bid');

// Apply bids to the score map
// INPUT: cache.scores
// OUTPUT: cache.scores
export function applyBids(bot){
  return new Promise(function(resolve, reject){
    Bid.get(bot)
    .then(bot => cycleThroughBids(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))

    function cycleThroughBids(bot){
      return new Promise(function(resolve, reject){
        for(var i = 0; i < bot.bids.length; i ++){
          var bid = bot.bids[i];
          for (var j = 0; j < bot.scores.length; j++){
            var score = bot.scores[j];
            // needs to match bid attributes with task attributes
          }
        }
        resolve(bot)
      })
    }
    
  })
}
