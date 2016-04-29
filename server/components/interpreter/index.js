'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Patterns = require('./interpreter.patterns');
var Context = require('../context');

export function getResponse(message){
  return new Promise(function(resolve, reject){
    Interpret.setupResponse(message)
    .then(res => Patterns.check(res))
    .then(res => Context.get(res))
    .then(res => Interpret.getEntities(res))
    .then(res => Interpret.mergeEntities(res))
    .then(res => Interpret.convertButtonPayload(res))
    .then(res => resolve(res))
    .catch(err => reject(err))
  });
}
