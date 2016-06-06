var Promise = require("bluebird");
var request = require("request");

export function classify(text){
 return new Promise(function(resolve, reject){
  if(typeof bot.message.text !== 'string'){
     reject('Message must have text.')
     return false;
   }
   var options = {
     url: "https://api.wit.ai/message",
     qs: {
       q: text,
       //context: context,
       v: '2014102'
     },
     auth: {
       bearer: process.env.WIT_SECRET
     }
   }

   request.get(options, function(err, response, body){
     if(err){
       reject(err);
     }
     var responseObj = JSON.parse(body);
     var standardized = toStandard(responseObj);
     resolve(responseObj)
   })
 })
}

function toStandard(witResponse){
  return witResponse;
}
