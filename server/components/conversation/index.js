'use strict';

var Promise = require("bluebird");
var Interpret = require('../interpreter');
var Paths = require('./paths');
import * as Loader from './paths/paths.loader';
var Messages = require ('../messages');
var Conversation = require('./conversation.model').constructor;

export function respond(message){
  return new Promise(function(resolve, reject){
    var conversation;
    Interpret.getResponse(message)
    .then(response => {
      console.log('RESPONSE')
      console.log(response)
      conversation = new Conversation(message.userId, message);
      Paths.route(conversation, response)
        .then(res => resolve(res))
        .catch(err => reject(err))
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
