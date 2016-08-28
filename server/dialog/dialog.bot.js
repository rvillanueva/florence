'use strict';

var Promise = require('bluebird');
var UserService = require('../components/user');
var MessageService = require('../components/message');

function Bot(setup){
  this.message = setup.message;
  this.user = setup.user;
  this.state = setup.user.state || {};
  this.state.params = this.state.params || {};
  this.send = function(data){
    return new Promise((resolve, reject) => {
      var message = {
        content: {
          text: data.text
        }
      };
      message.userId = this.user._id;
      MessageService.send(message)
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }
}

export function create(message){
  return new Promise(function(resolve, reject){
    UserService.getOrCreate(message.from)
    .then(user => {
      if(!user){
        reject(new Error('No valid user returned.'))
      }
      var setup = {
        message: message,
        user: user
      }
      var bot = new Bot(setup);
      resolve(bot)
    })
    .catch(err => reject(err))
  })
}
