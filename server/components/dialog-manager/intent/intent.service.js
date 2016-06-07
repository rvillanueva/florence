'use strict';

var Promise = ('bluebird');
import Intent from './intent.model';

// Get all bids
// OUPUT: cache.bids
export function getByValue(bot){
  // Get bids
  Intent.findOne({'value': bot.cache.intentValue})
    .then(intent => {
      bot.cache.intent = intent;
      resolve(bot)
    })
    .catch(err => reject(err))
}
