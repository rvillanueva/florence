var Wit = require('./wit');

function mergeEntitiesIntoAction(action, entities, overwrite){
  for (var key in entities) {
    if (entities.hasOwnProperty(key)) {
      if(overwrite === true || !action.entities[key]){
        action.entities[key] = entities[key];
      }
    }
  }
}

export function getIntents(message, context){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 return new Promise(function(resolve, reject){
   Wit.getIntents(message, context)
   .then(intents => {resolve(intents)})
   .catch(err => {reject(err)})
 })
}


export function chooseActionFromIntents(context, intents){
  // hardcode some commands in here
 return new Promise(function(resolve, reject){
   var switchConfidence = 0.7;
   var action = {
     intent: null,
     entities: {}
   }
   // if top intent is > 70%, switch intents
   // should really cycle and choose highest intent -- FIX LATER
   if(intents[0].intent == action.intent){
     // merge entities and overwrite values
     mergeEntitiesIntoAction(action, intents[0].entities, true)
   }
   if(intents[0].confidence >= switchConfidence){
     action.intent = intents.intent;
     action.entities = intents[0].entities;
   } else {
     // otherwise merge in top intent's entities but don't overwrite existing values -- QUESTIONABLE
     mergeEntitiesIntoAction(action, entities, false)
   }
   resolve(action);
 })
}

export function chooseActionFromRule(context, intent){
  // hardcode some commands in here
 return new Promise(function(resolve, reject){
   var action = {
     intent: intent,
     entities: context.entities
   }
   resolve(action);
 })
}
