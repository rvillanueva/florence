'use strict';

var Promise = require('bluebird');
var Intent = require('../../models/intent/intent.model');

export function getByKey(key){
  return Intent.find({key: key})
}
