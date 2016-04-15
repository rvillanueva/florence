var Promise = require('bluebird');
var Messenger = require('./messenger');
var Conversation = require('../conversation');
var Queue = require('./messages.queue')
/*
Standardized message format

message: {
  userId: String,
  timestamp: Date,
  from: String, // user, app
  text: String,
  input: String,
  attachments: Array,
  data: Object,
  interface: String,
  messenger: {
    mid: String,
    seq: Number
  }
}

*/

export function send(message){
  return new Promise(function(resolve, reject){
    console.log('Adding message to queue:')
    console.log(message);
    Queue.add(message)
      .then(res => resolve(res))
      .catch(err => reject(err))
  });
}

// Receive standardized message from any messaging interface
export function receive(message){
  // Add messaging logging here;
  Conversation.respond(message) // Figure out how to respond to the message
}

export function deliver(message){
  return new Promise(function(resolve, reject){
    Messenger.send(message)
      .then(res => resolve(res))
      .catch(err => reject(err))
  });
}
