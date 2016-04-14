var Promise = require("bluebird");
var request = require("request");

export function intents(message, context){
 return new Promise(function(resolve, reject){
   //send request;
   if(typeof message !== 'string'){
     reject('Message must be a string.')
     return false;
   }
   var options = {
     url: "https://api.wit.ai/message",
     qs: {
       q: message.text,
       context: context
     },
     auth:
   }
   request.get('https://api.wit.ai/message', options).success(function(intents){
     resolve(intents);
   }).error(function)
 })
}
