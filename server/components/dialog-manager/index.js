'use strict';

var Promise = require('bluebird');
import Bot from './bot';
import BotState from './bot/bot.model';
var DialogService = require('./dialog.service');

export function respond(received){
  return new Promise(function(resolve, reject){
    var bot = new Bot(received.userId, received);
    bot.init()
    .then(bot => DialogService.handleTextParsing(bot))
    //.then(bot => Flow.handleAskPermissionResponse(bot))
    .then(bot => DialogService.handleTaskResponse(bot))
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
