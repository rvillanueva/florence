var Wit = require('./wit');

export function getIntents(message, context, override){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 return new Promise(function(resolve, reject){
   console.log('getting intent')
   /*(if(intentOverride){
     resolve([{
       intent: intentOverride
     }])
   } else {
     Wit.getIntents(message, context)
     .then(intents => resolve(intents))
     .catch(err => reject(err))
   }
 */
   if (override) {
     resolve([{
       intent: override
     }])
   } else if (context.intent) {
     resolve([{
       intent: context.intent
     }])
   } else resolve(
     [{
       intent: 'logScore'
     }])
   })

}


export function chooseResponse(context, intents){
  // hardcode some commands in here
 return new Promise(function(resolve, reject){
   var switchConfidence = 0.7;
   var response = context;
   var best = intents[0];   // should really cycle and choose highest intent -- FIX LATER
   var override = false;

   // if there's no intent or confidence is high, switch intents and adopt new entities
   if(!response.intent || best.confidence >= switchConfidence){
     response.intent = best.intent;
     response.entities = best.entities;
   } else if (best.intent == response.intent){
     // if the intents match, merge them but adopt new entities
     override = true;
   }
   // otherwise, just adopt previously unknown entities and hope they fill in gaps
  response = mergeEntities(response, best.entities, override)
   console.log('response')
   console.log(response);
   resolve(response);
 })
}

function mergeEntities(response, entities, overwrite){
  var merged = response;
  for (var key in entities) {
    if (res.hasOwnProperty(key)) {
      if(overwrite === true || !action.entities[key]){
        res.entities[key] = entities[key];
      }
    }
  }
  return merged;
}
