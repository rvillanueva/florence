var Promise = require("bluebird");
var request = require("request");

export function intents(message, context){
 return new Promise(function(resolve, reject){
   if(typeof message.text !== 'string'){
     reject('Message must be a string.')
     return false;
   }
   var options = {
     url: "https://api.wit.ai/message",
     qs: {
       q: message.text,
       context: context,
       v: '2014102'
     },
     auth: {
       bearer: process.env.WIT_SECRET
     }
   }
   request.get(options, success(function(err, response, body){
     resolve(body);
   }).error(function(err){
     reject(err)
   })
 })
}
