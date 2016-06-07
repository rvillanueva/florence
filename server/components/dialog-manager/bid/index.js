'use strict';

var BidService = require('./bid.service');

export function create(bot){

}

// Get all bot bids
// OUtPUT: cache.bids
export function get(bot){
  return BidService.get(bot);
}
