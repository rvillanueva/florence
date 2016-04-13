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
var Converse = require('./conversation.service');
var Interpret = require('../interpreter');
var Skills = require('./skills');

export function respond(user, message){
 return new Promise(function(resolve, reject){
   // Interpret message
   Interpret.intent(user, message)
    .then(Skills.do())
   // Identify skill
   // Do skill
   // Respond to intent
   // Respond with next best step
   resolve(true);
 })
}
