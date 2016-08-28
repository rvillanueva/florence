'use strict';

var Promise = require('bluebird');
var DialogBot = require('./dialog.bot');
var DialogService = require('./dialog.service');

export function receive(message){
  return new Promise(function(resolve, reject){
    DialogBot.create(message)
    .then(bot => DialogService.classify(bot))
    .then(bot => DialogService.handleSlotFilling(bot))
    .then(bot => DialogService.handleGivenIntent(bot))
    .then(bot => DialogService.handleIntent(bot))
    .then(bot => DialogService.handleExceptions(bot))
    .then(bot => DialogService.updateState(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
