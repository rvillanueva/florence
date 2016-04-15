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
//var Conversation = require('./conversation.service');
var Interpret = require('../interpreter');
var Skills = require('../skills');
var Messages = require ('../messages')

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


var Conversation = function(userId, action){
  this.userId = userId;
  this.action = action;
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
     clarify: (text, entities) => {
       // ask, and set entities as expected
     },
     action: this.action,
     user: () => {
       //get user
     }
  }
}

export function test(message){
  var conversation = new Conversation(message.userId);
  conversation.say('Hello to you!');
  conversation.say('You\'re awesome.');
}

export function respond(message){
  return new Promise(function(resolve, reject){
    var conversation = new Conversation(message.userId);
    Interpret.getAction(message)
    .then(Skills.respond(conversation, action))
    .then(res => {
      // route to skill
      resolve(res)
      console.log(res)
    })
    // when done, resolve
    .catch(err => reject(err))
  })
}
