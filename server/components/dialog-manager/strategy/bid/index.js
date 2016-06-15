'use strict';

var Promise = require('bluebird');
var Bid = require('./bid.model');
var BidService = require('./bid.service');

// INPUT: cache.bid

/*
bid: {
  rewards: []
  expiration.minutes and/or expiration.turns
}

*/
export function create(bot){

}

// Get all bot bids
// OUtPUT: cache.bids
export function get(bot){
  return BidService.get(bot);
}

export function applyToScores(bot){
  BidService.get(bot)
  .then(bot => BidService.applyEachBid(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}
