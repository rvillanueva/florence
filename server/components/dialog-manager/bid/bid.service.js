'use strict';

var Promise = ('bluebird');
import Bid from './bid.model';

// Get all bids
// OUPUT: cache.bids
export function get(bot){
  // Get bids
  Bid.find({'userId': bot.user._id})
    .then(bids => {
      bot.cache.bids = bids;
      resolve(bot)
    })
    .catch(err => reject(err))
}
