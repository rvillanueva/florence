'use strict';

var Promise = require('bluebird');
import Bid from './bid.model';
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
      userId: bot.user._id,
      created: {
        date: new Date(),
        turn: bot.turn
      },
      open: true,
      target: bidRef.target,
      force: bidRef.force,
      modifier: bidRef.modifier,
      expiration: bidRef.expiration
    }
    console.log('Creating bid...')
    console.log(bid);
    Bid.create(bid)
    .then(bid => {
      console.log('Bid created:')
      console.log(bid)
      resolve(bot)
    })
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

export function fulfillFromTask(bot){
  return new Promise(function(resolve, reject){
    BidService.fulfillFromTask(bot)
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
