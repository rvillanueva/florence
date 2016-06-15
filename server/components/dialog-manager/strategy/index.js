'use strict';

var Promise = require('bluebird');
var StrategyService = require('./strategy.service');

// OUTPUT: cache.task
export function selectNextTask(bot){
  return new Promise(function(resolve, reject){
    StrategyService.getAllTasks(bot)
    .then(bot => StrategyService.initScoreMap(bot))
    .then(bot => StrategyService.applyNextTaskScoring(bot))
    .then(bot => StrategyService.selectBestTask(bot))
    .then(bot => StrategyService.updateConversation(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function selectResponseTask(bot){
  StrategyService.getResponseTasks(bot)
  .then(bot => StrategyService.initScoreMap(bot))
  .then(bot => StrategyService.applyResponseScoring(bot))
  .then(bot => StrategyService.selectBestTask(bot))
  .then(bot => StrategyService.handleClarifications(bot))
  .then(bot => StrategyService.handleConfusion(bot))
}
