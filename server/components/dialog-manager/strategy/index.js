'use strict';

var Promise = require('bluebird');
var StrategyService = require('./strategy.service');
var Rules = require('./rules');
var Tasks = require('../tasks')

export function select(bot){

}

export function map(bot){
  return new Promise(function(resolve, reject){
    Tasks.get(bot)
    .then(bot => Rules.getScores(bot))
    .then(bot => StrategyService.applyBids(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function applyBids(bot){
  return StrategyService.applyBids(bot)
}
