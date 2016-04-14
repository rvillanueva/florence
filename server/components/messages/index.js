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
  console.log('Sending message...')
  Messenger.send(message);
}

export function receive(message){
  Conversation.test(message)
}
