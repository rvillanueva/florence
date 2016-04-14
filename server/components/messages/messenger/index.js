var Promise = require("bluebird");
var Messenger = require('./messenger.service');

export function send(message) {
  return new Promise(function(resolve, reject){
    Format.toMessenger(message)
      .then(formatted => Messenger.sendToMessenger(formatted))
      .then(res => resolve(res))
      .catch(err => {
        console.log(err);
        reject(err);
      })
  })
}

export function receive(data){
  Messenger.concatMessages(data)
    //.then(messages => Messenger.filterOutDeliveries(messages))
    //.then(filtered => Messenger.checkUsersExist(filtered))
    .then(messages => Messenger.processEachMessage(messages))
    .catch(err => console.log(err))
}
