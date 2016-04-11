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
var Measures = require('./measures');

// Route to correct conversation or response set


export function respond(user, messenger) {
  // route response based on user active prompt
  return new Promise(function (resolve, reject) {
    resolve(Measures.mood().conversation(user, messenger));
  });
}
