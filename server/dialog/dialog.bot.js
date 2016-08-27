'use strict';

var Promise = require('bluebird');
var UserService = require('../user');
var MessageService = require('../message');


export function create(message){
  return new Promise(function(resolve, reject){
    var bot = {
      message: message,
      send: function(data){
        return new Promise(function(resolve, reject){
          var message = data;
          message.userId = this.user._id;
          MessageService.send(message)
          .then(() => resolve(this))
          .catch(err => reject(err))
        })
      }
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
