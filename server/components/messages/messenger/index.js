var Promise = require("bluebird");
var Messenger = require('./messenger.service');
var Format = require('./messenger.formatter');

export function send(message) {
  return new Promise(function(resolve, reject){
    Format.toMessenger(message)
      .then(formatted => Messenger.sendToApi(formatted))
      .then(res => resolve(res))
      .catch(err => {
        console.log(err);
        reject(err);
      })
  })
}

export function receive(data){
  Messenger.compileMessages(data)
    //.then(messages => Messenger.filterOutDeliveries(messages))
    //.then(filtered => Messenger.checkUsersExist(filtered))
    .then(messages => Messenger.processEachMessage(messages))
    .catch(err => console.log(err))
}
