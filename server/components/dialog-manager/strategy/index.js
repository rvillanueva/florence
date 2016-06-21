'use strict';

var Promise = require('bluebird');
var StrategyService = require('./strategy.service');
var Response = require('./response');
var Skills = require('./skills');

// OUTPUT: cache.task
export function selectNext(bot){
  return new Promise(function(resolve, reject){
    StrategyService.getTasks(bot)
    .then(bot => StrategyService.initScoreMap(bot))
    .then(bot => StrategyService.applyBids(bot))
    .then(bot => StrategyService.selectBestTask(bot))
    .then(bot => StrategyService.updateConversation(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function selectResponse(bot){
  return new Promise(function(resolve, reject){
    Response.handleExpectedInputs(bot))
    .then(bot => Response.handleUnexpected(bot))
    .then(bot => Response.handleRequiredSlots(bot))
    .then(bot => Response.handleNonUnderstanding(bot))
    .then(bot => StrategyService.initScoreMap(bot))
    .then(bot => StrategyService.filterByConditions(bot))
    .then(bot => StrategyService.selectBestTask(bot))
    .then(bot => StrategyService.updateConversation(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
