var Promise = require('bluebird');
var Queue = require('./message.queue');
var Router = require('./message.router');

export function send(message){
  console.log('Bot says: ' + message.content.text);
  console.log(message)
  message.created = new Date();
  return Queue.add(message)
}

// Receive and log standard message from any messaging interface
export function receive(message){
  return new Promise(function(resolve, reject){
    // Add messaging logging here;
    console.log(message.userId + ' says: ' + message.content.text);
    resolve(message)
  })
}

// Receives raw message data and resolves an array of messages
export function standardize(data, provider){
  return new Promise(function(resolve, reject){
    console.log(data)
    Router.standardize(data, provider)
    .then(messages => resolve(messages))
    .catch(err => reject(err))
  })
}
