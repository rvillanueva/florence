var Promise = require("bluebird");
var MessengerService = require('./messenger.service');
var Format = require('./messenger.formatter');

export function send(message) {
  return new Promise(function(resolve, reject){
    Format.toMessenger(message)
      .then(formatted => MessengerService.sendToApi(formatted))
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

export function standardize(data){
  return new Promise(function(resolve, reject){
    MessengerService.convertToArray(data)
      //.then(messages => Messenger.filterOutDeliveries(messages))
      //.then(filtered => Messenger.checkUsersExist(filtered))
      .then(unformatted => MessengerService.formatEachMessage(formatted))
      .then(messages => resolve(messages))
      .catch(err => console.log(err))
  })
}
