'use strict';

var MessengerService = require('./messenger');
var TwilioService = require('./twilio');

export function deliver(message){
  return new Promise(function(resolve, reject){
    if(message.provider == 'messenger'){
      // TODO handle logs better
      var log = message.text || message.attachment;
      console.log('Reply to ' + message.userId + ': ' + log);
      MessengerService.send(message)
      .then(log => resolve(log))
      .catch(err => reject(err))
    } else if(message.provider == 'mobile'){
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

export function standardize(data, provider){
  return new Promise(function(resolve, reject){
    if(provider == 'messenger'){
      MessengerService.standardize(data)
      .then(message => resolve(message))
      .catch(err => reject(err))
    } else if(provider == 'twilio'){
      TwilioService.standardize(data)
      .then(message => resolve(message))
      .catch(err => reject(err))
    } else {
      reject(new Error('Provider ' + provider + ' not recognized.'))
    }
  })
}
