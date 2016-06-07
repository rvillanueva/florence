'use strict';

var Promise = require('bluebird');
var RulesService = require('./rules.service')
var SocialRules = require('./rules.social');

/*
RULES
Maps intents and response attributes to bid targets and values
Also models social rules such as cost of conversation length and rapid topic switching
*/

// format: if this intent, create this type of reward in bid
// if this attribute found, create another reward in bid

// INPUT: cache.tasks
// OUTPUT: cache.scores
export function applyToScores(bot){
  return new Promise(function(resolve, reject){
    RulesService.initMap(bot)
    .then(bot => RulesService.scoreTasks(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
