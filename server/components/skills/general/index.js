'use strict';
var Promise = require('bluebird');
var Messages = require('../../messages');

export function welcome(){
  new Promise(function(resolve, reject){
    Messages.send()
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
