// types of dialog
/*

-greeting
-insights
-


response structure:
choice: Number,
value: String,
input: String // text, choice
prompt: String,
entry: String,
response: String


*/

// Starts a conversation
var Promise = require("bluebird");
var Conversation = require('./conversation.service');
var Interpret = require('../interpreter');
var Skills = require('../skills');
var Messages = require ('../messages')

export function respond(user, message){
 return new Promise(function(resolve, reject){
   // Interpret message
   Interpret.intents(user, message)
    .then(intents => Skills.choose(intent)) // Select step based on intents
    .then(action => Skills.do(user, action)) // Do based on intent
    .then(Conversation.selectNextBest(user))
    .then(action => Skills.do(user, action));
   // Do skill
   // Respond to intent
   // Respond with next best step
   resolve(true);
 })
}

export function test(message){
  var reply = {
    userId: message.userId,
    text: 'Hello world!'
  }
  Messages.send(reply);
}
