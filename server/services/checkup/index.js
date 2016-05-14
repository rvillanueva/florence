'use strict';
var Promise = require('bluebird');

export function run(bot){
  return new Promise(function(resolve, reject){
    // Check what
    resolve(bot)
  })
}

export function start(bot, params){
  return new Promise(function(resolve, reject){
    bot.state.status = 'checkup';
    bot.state.checkup = bot.state.checkup || {};
    bot.state.checkup.active = true;
    resolve(bot)
  })
}

export function receive(bot){
  return new Promise(function(resolve, reject){
    // validate response
    // accept it or redirect
    // set status to checkup
    bot.state.status = 'checkup';
    resolve(bot)
  })

}
