'use strict';

var Promise = require("bluebird");
var Interpret = require('../interpreter');
var Paths = require('./paths');
var Messages = require ('../messages');
import User from '../../api/user/user.model';
var Conversation = require('./conversation.model').constructor;

export function respond(message){
  return new Promise(function(resolve, reject){
    var conversation;
    Interpret.getAction(message)
    .then(action => {
      conversation = new Conversation(message.userId, message);
      //Paths.route(conversation, action);
      resolve(action);
    })
    .catch(err => reject(err))
  })
}


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

/*export function respond(user, message){
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
}*/
