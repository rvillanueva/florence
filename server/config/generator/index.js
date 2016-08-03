'use strict';

var Promise = require('bluebird');
var UserGenerator = require('./users');
var EntryGenerator = require('./entries');

export function users(params){
  return UserGenerator.generate(params);
}

export function entries(params){
  return EntryGenerator.generate(params);
}
