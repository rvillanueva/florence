'use strict';

var Receive = require('./conversation.receive');
var Next = require('./conversation.next')
var Converse = require('./conversation.converse')
var Checkup = require('../checkup')

var router = {
  receiving: function(bot){
    return Receive.run(bot);
  },
  conversing: function(bot){
    return Converse.run(bot)
  },
  checkup: function(bot){
    return Checkup.run(bot);
  },
  next: function(bot){
    return Next.run(bot);
  },
}

export function route(bot){
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'waiting' || bot.state.status == 'done'){
      // End loop
      bot.updateState()
      .then(bot => resolve(bot))
      .then(err => reject(err))
    } else if (bot.state.status && typeof router[bot.state.status] == 'function'){
      clearCache(bot)
      .then(bot => router[bot.state.status](bot))
      .then(bot => route(bot))
      .then(bot => resolve(bot))
      .then(err => reject(err))
    } else {
      reject('Error: Unknown status ' + bot.state.status);
    }
  })
}

function clearCache(bot){
  return new Promise(function(resolve, reject) {
    bot.cache = {};
    resolve(bot);
  })
}
