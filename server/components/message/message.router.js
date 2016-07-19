'use strict';

var TwilioService = require('./twilio');

export function deliver(message){
  return new Promise(function(resolve, reject){
    if(message.provider == 'mobile'){
      var log = message.text || message.attachment;
      console.log('Reply to ' + message.userId + ': ' + log);
      TwilioService.send(message)
      .then(log => resolve(log))
      .catch(err => reject(err))
    } else {
      reject(new Error('Provider ' + message.provider + ' not recognized.'))
    }
  })
}

export function standardize(data, api){
  return new Promise(function(resolve, reject){
    if(api == 'twilioSMS'){
      TwilioService.standardize(data)
      .then(message => resolve(message))
      .catch(err => reject(err))
    } else {
      reject(new Error('Provider ' + provider + ' not recognized.'))
    }
  })
}
