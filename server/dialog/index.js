'use strict';

var Promise = require('bluebird');
var DialogBot = require('./dialog.bot');
var DialogService = require('./dialog.service');

export function receive(message){
    DialogBot.create(message)
    .then(bot => DialogService.classify(bot))
    .then(bot => DialogService.handleSlotFilling(bot))
    .then(bot => DialogService.handleNewIntent(bot))
    .then(bot => DialogService.filterResponses(bot))
    .then(bot => DialogService.askFollowups(bot))
    .then(bot => DialogService.handleResponseExecution(bot))
    .then(bot => DialogService.updateState(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
}
