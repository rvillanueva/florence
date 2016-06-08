'use strict';

var Promise = require('bluebird');
var Bid = require('../../bid');
var BidService = require('./bids.service');

export function applyToScores(bot){
  Bid.get(bot)
  .then(bot => BidService.applyEachBid(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}
