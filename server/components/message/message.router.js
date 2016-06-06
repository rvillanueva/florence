'use strict';

var Messenger = require('./messenger');

export function deliver(message){
  return new Promise(function(resolve, reject){
    if(message.provider == 'messenger'){
      // TODO handle logs better
      var log = message.text || message.attachment;
      console.log('Reply to ' + message.userId + ': ' + log);
      Messenger.send(message)
      .then(log => resolve(log))
      .catch(err => reject(err))
    } else {
      reject(new TypeError('Provider ' + provider + ' not recognized.'))
    }
  })
}

export function standardize(data, provider){
  return new Promise(function(resolve, reject){
    if(provider == 'messenger'){
      Messenger.standardize(data)
      .then(messages => resolve(messages))
      .catch(err => reject(err))
    } else {
      reject(new TypeError('Provider ' + provider + ' not recognized.'))
    }
  })
}
