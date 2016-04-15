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

'use strict';

var Promise = require("bluebird");
//var Conversation = require('./conversation.service');
var Interpret = require('../interpreter');
var Skills = require('../skills');
var Messages = require ('../messages');
import User from '../../api/user/user.model';
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


var Conversation = function(userId, action, message){
  this.userId = userId;
  this.action = action;
  this.message = message;
  return {
     say: (text) => {
       return new Promise((resolve, reject) => {
         let message = {
           userId: this.userId,
           text: text
         }
         Messages.send(message)
           .then(res => resolve(res))
           .catch(err => reject(err))
       })
     },
     action: this.action,
     message: this.message,
     user: () => {
       return new Promise(function(resolve, reject){
         User.findById(this.userId, '-salt -password')
         .then(user => resolve(user))
         .catch(err => reject(err))
       })
     },
     context: ()=>{
       return new Promise(function(resolve, reject){
         Context.getContext(this.userId)
         .then(context => resolve(context))
         .catch(err => reject(err))
       })
     }
     /*, clarify: (text, entities) => {
       // ask, and set entities as expected
     }*/
  }
}

export function respond(message){
  return new Promise(function(resolve, reject){
    var conversation;
    Interpret.getAction(message)
    .then(action => {
      conversation = new Conversation(message.userId, action, message);
      Skills.respond(conversation, action)
    })
    .then(res => {
      // route to skill
      resolve(res)
      console.log(res)
    })
    // when done, resolve
    .catch(err => reject(err))
  })
}
