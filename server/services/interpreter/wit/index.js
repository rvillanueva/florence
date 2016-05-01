var Promise = require("bluebird");
var request = require("request");

export function getEntities(message, context){
 return new Promise(function(resolve, reject){
  if(typeof message.text !== 'string'){
     reject('Message must have text.')
     return false;
   }
   var options = {
     url: "https://api.wit.ai/message",
     qs: {
       q: message.text,
       //context: context,
       v: '2014102'
     },
     auth: {
       bearer: process.env.WIT_SECRET
     }
   }

   request.get(options, function(err, response, body){
     var returned = JSON.parse(body);
     if(err){
       reject(err);
     }
     // Need to process into entities
     resolve(returned);
   })
 })
}
