'use strict';

var Promise = require('bluebird');
import Intent from '../../models/intent/intent.model';

export function getByKey(key){
  return Intent.findOne({key: key})
}
