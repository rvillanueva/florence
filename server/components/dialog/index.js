'use strict';

var Promise = require('bluebird');
import Bot from './bot';
var DialogService = require('./dialog.service');

export function respond(data){
  return new Promise(function(resolve, reject){
    var bot = new Bot(data);
    bot.init()
    .then(bot => DialogService.handleExpectedResponse(bot))
    .then(bot => DialogService.handleNextStep(bot))
    .then(bot => bot.update())
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function initiate(userId){
  return new Promise(function(resolve, reject){
    var bot = new Bot(userId);
    bot.init()
    .then(bot => DialogService.handleNotification(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
