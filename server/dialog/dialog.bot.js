'use strict';

var Promise = require('bluebird');
var UserService = require('../user');

export function create(message){
  return new Promise(function(resolve, reject){
    var bot = {
      message: message
    }
    UserService.getOrCreate(message.from)
    .then(user => {
      if(!user){
        reject(new Error('No valid user returned.'))
      }
      bot.user = user;
      resolve(newBot)
    })
    .catch(err => reject(err))
  })
}
