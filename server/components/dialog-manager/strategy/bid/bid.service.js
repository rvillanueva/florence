'use strict';

var Promise = require('bluebird');
import Bids from './bid.model';

// Get all bids
// OUPUT: cache.bids
export function getActive(bot){
  // Get bids
  Bids.find({'userId': bot.user._id})
    .then(bids => {
      bot.cache.bids = bids;
      resolve(bot)
    })
    .catch(err => reject(err))
}


// Apply each bid to the score map
// INPUT: cache.scores, cache.bids
// OUPUT: cache.scores

export function applyEachBid(bot){
  return new Promise(function(resolve, reject){
    for(var i = 0; i < bot.cache.bids.length; i ++){
      var bid = bot.cache.bids[i];
      for (var j = 0; j < bot.cache.scores.length; j++){
        var score = bot.cache.scores[j];
        score = applyBid(score, bid);
      }
    }
    resolve(bot)

    function applyBid(score, bid){
      if(isMatch(score, bid)){
        score.force = bid.force;
        if(typeof bid.modifier === 'number'){
          score.value = score.value * bid.modifier;
        }
        return score;
      }
    }

    function isMatch(score, bid){
      var matched = true;
      var entities = bid.targets.entities
      if(entities){
        for (var entity in bid.targets.entities) {
          if (entities.hasOwnProperty(param)) {
            if (bot.entities[entity] !== bid.targets.entities[entity]) {
              matched = false;
            }
          }
        }
      }
      return matched;
    }
  })
}
