'use strict';

var Promise = require('bluebird');

export function hasQueue(bot){
  if(bot.state.queue && bot.state.queue.length > 0){
    return true
  }

  if (bot.state.diverted && bot.state.diverted.length > 0){
    return true;
  }

  return false;
}

export function run(bot){
  return new Promise(function(resolve, reject){
    resolve(bot)
  })
}
