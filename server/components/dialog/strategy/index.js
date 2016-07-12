'use strict';

var Promise = require('bluebird');
var StrategyService = require('./strategy.service');
var Bid = require('./bid');
var Task = require('../task');

// OUTPUT: cache.task
export function selectNext(bot){
  return new Promise(function(resolve, reject){
    Task.cache(bot)
    .then(bot => Bid.applyToScores(bot))
    .then(bot => StrategyService.selectTopTask(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function selectResponse(bot){
  return new Promise(function(resolve, reject){
    StrategyService.handleUnfilledSlots(bot)
    .then(bot => StrategyService.getTaskFromResponseAction(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
