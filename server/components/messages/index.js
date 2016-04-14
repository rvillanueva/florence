var Promise = require('bluebird');
var Messenger = require('./messenger');

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
  Messenger.send(message);
}

export function receive(message){
  // Log here
  Conversation.respond(message)
}
