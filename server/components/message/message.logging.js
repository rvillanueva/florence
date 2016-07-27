'use strict';

import Message from '../../models/message/message.model';

var Promise = require('bluebird');

export function create(message){
  return new Promise(function(resolve, reject){
    Message.create(message)
    .then(message => resolve(message))
    .catch(err => reject(err))
  })
}
