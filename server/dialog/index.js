'use strict';

var Promise = require('bluebird');
var DialogBot = require('./dialog.bot');
var DialogService = require('./dialog.service');

export function receive(message){
    DialogBot.create(message)
    .then(bot => DialogService.classify(bot))
    .then(bot => DialogService.handleSlotFilling(bot))
    .then(bot => DialogService.handleGivenIntent(bot))
    .then(bot => DialogService.handleIntent(bot))
    .then(bot => DialogService.handleNoIntent(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
}
