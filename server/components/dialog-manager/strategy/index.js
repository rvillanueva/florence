'use strict';

var Promise = require('bluebird');
var StrategyService = require('./strategy.service');

var Task = require('../task');

var Intents = require('./intents');
var Rules = require('./rules');
var Bids = require('./bids');

// OUTPUT: cache.task
export function selectTask(bot){
  return new Promise(function(resolve, reject){
    Task.get(bot)
    .then(bot => Task.buildIndex(bot))
    .then(bot => StrategyService.initScoreMap(bot))
    .then(bot => Intents.applyToScores(bot))
    .then(bot => Rules.applyToScores(bot))
    .then(bot => Bids.applyToScores(bot))
    .then(bot => StrategyService.selectBestTask(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
