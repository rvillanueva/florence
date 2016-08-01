'use strict';

var Promise = require('bluebird');
import Bot from '../bot';
var DialogService = require('./dialog.service');

export function respond(options){
  return new Promise(function(resolve, reject){
    var bot = new Bot(options);
    bot.init()
    .then(bot => DialogService.handleExpectedResponse(bot))
    .then(bot => DialogService.handleNextTask(bot))
    .then(bot => bot.update())
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function notify(options){
  return new Promise(function(resolve, reject){
    var bot = new Bot(options);
    bot.init()
    .then(bot => DialogService.handleNotification(bot))
    .then(bot => DialogService.handleNextTask(bot))
    .then(bot => bot.update())
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
