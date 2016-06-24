'use strict';

var Promise = require('bluebird');
var Bid = require('./bid.model');
var BidService = require('./bid.service');

// INPUT: cache.bid

/*
bid: {
  targets: {}
  expiration.minutes and/or expiration.turns
}

*/
export function create(bot){
  return new Promise(function(resolve, reject){
    var bidRef = bot.cache.newBid;
    var bid = {
      created: {
        date: new Date(),
        turn: bot.turn
      },
      targets: bidRef.targets,
      force: bidRef.force,
      modifier: bidRef.modifier,
      expiration: bidRef.expiration
    }
    Bid.create(bid)
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function applyToScores(bot){
  return new Promise(function(resolve, reject){
    BidService.getActive(bot)
    .then(bot => BidService.applyEachBid(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
