'use strict';

var Promise = require('bluebird');
import Bot from './bot';
import BotState from './bot/bot.model';
var DialogService = require('./dialog.service');

export function respond(data){
  return new Promise(function(resolve, reject){
    var bot = new Bot(data);
    bot.init()
    .then(bot => DialogService.logMessage(bot))
    .then(bot => DialogService.getResponse(bot))
    .then(bot => DialogService.handleResponse(bot))
    .then(bot => DialogService.handleNextTask(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function initiate(userId){
  return new Promise(function(resolve, reject){
    var bot = new Bot(userId);
    bot.init()
    .then(bot => DialogService.handleNotification(bot))
    .then(bot => DialogService.handleNextTask(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

module.exports.BotState = BotState;
