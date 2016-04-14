var Promise = require('bluebird');
var Messenger = require('./messenger');
var Conversation = require('../conversation');

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
    console.log('Sending message...')
    Messenger.send(message)
      .then(res => resolve(res))
      .catch(err => reject(err))
  });
}

// Receive standardized message from any messaging interface
export function receive(message){
  // Add messaging logging here;
  Conversation.test(message) // Figure out how to respond to the message
}
