var Wit = require('./wit');

export function getIntents(message, context, skip){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 return new Promise(function(resolve, reject){
   console.log('getting intent')
   if(skip){
     resolve([{
       intent: 'logScore',
       entities: {
         "score": 7
       },
       confidence: 1
     }])
   } else {
     Wit.getIntents(message, context)
     .then(intents => resolve(intents))
     .catch(err => reject(err))
   }
 })
}


export function chooseResponse(context, intents){
  // hardcode some commands in here
 return new Promise(function(resolve, reject){
   var switchConfidence = 0.7;
   var response = context;
   var best = intents[0];
   var override = false;
   // if top intent is > 70%, switch intents
   // should really cycle and choose highest intent -- FIX LATER
   if (best.confidence >= switchConfidence){
     override = true;
     response.intent = best.intent;
     response.entities = best.entities;
   } else {
     if(best.intent == response.intent){
       // merge entities and overwrite values
       override = true;
     }
     response = mergeEntities(response, best.entities, override)
   }

   // otherwise merge in top intent's entities but don't overwrite existing values -- QUESTIONABLE
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
