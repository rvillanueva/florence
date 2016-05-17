'use strict';

var Promise = require('bluebird');
import User from '../../api/user/user.model';

export function unsubscribe(bot, action){
  return new Promise(function(resolve, reject){
    User.findById(bot.userId)
    .then(user => {
      user.active = false;
      return user.save()
    })
    .then(() => {
      bot.say('Okay, I won\'t send you anything else without you starting the conversation. If you ever want me to restart check ins, just say \'subscribe\'.');
      resolve(bot);
    })
  })
}

export function subscribe(bot, action){
  return new Promise(function(resolve, reject){
    User.findById(bot.userId)
    .then(user => {
      user.active = true;
      return user.save()
    })
    .then(() => {
      bot.say('Great! You can now receive messages from me.');
      bot.say('Anything you want to talk about?');
      resolve(bot);
    })
  })
}
