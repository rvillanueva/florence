'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Patterns = require('./interpreter.patterns');
var Context = require('../context');

export function getEntities(bot){
  return new Promise(function(resolve, reject){
    Patterns.check(bot)
    .then(bot => Interpret.getEntities(bot))
    .then(bot => Interpret.mergeEntities(bot))
    .then(bot => Interpret.convertButtonPayload(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  });
}
