var Promise = require('bluebird');
var Messenger = require('./messenger');
var Bot = require('../../bot');
var Queue = require('./messages.queue');

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
    return Queue.add(message)
}

// Receive standardized message from any messaging interface
export function receive(message){
  // Add messaging logging here;
  console.log(message.userId + ' says: ' + (message.text || '[button: ' + message.button + ']'));
  Bot.respond(message) // Figure out how to respond to the message
}

export function deliver(message){
    var log = message.text || message.attachment;
    console.log('Reply to ' + message.userId + ': ' + log);
    return Messenger.send(message)
}
