var Promise = require("bluebird");
var request = require("request");

export function getEntities(bot){
 return new Promise(function(resolve, reject){
  if(typeof bot.message.text !== 'string'){
     reject('Message must have text.')
     return false;
   }
   var options = {
     url: "https://api.wit.ai/message",
     qs: {
       q: bot.message.text,
       //context: context,
       v: '2014102'
     },
     auth: {
       bearer: process.env.WIT_SECRET
     }
   }

   request.get(options, function(err, response, body){
     var parsed = JSON.parse(body);
     if(err){
       reject(err);
     }
     attachEntities(bot, parsed)
     .then(bot => resolve(bot))
     .catch(err => reject(err))
     // Need to process into entities
   })
 })
}

function attachEntities(bot, response){
  return new Promise(function(resolve, reject){
    bot.cache.entities = response.outcomes[0].entities;
    bot.state.entities = bot.cache.entities;
    resolve(bot);
  })
}
