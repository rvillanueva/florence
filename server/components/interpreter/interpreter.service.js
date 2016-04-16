var Wit = require('./wit');

export function getIntents(message, context, skip) {
  // if intent = trigger, skip Wit. otherwise, interpret intent & actions
  return new Promise(function(resolve, reject) {
    console.log('Parsing intent and entities...')
    if (skip) {
      resolve(skip)
    } else {
      Wit.getIntents(message, context)
      .then(intents => {
        resolve(intents)
      })
      .catch(err => {
        console.log('Wit response error: ')
        console.log(err)
        if (context.intent) {
          resolve([{
            intent: context.intent
          }])
        } else {
          reject(err)
        }
      })
    }
  })

  /*Wit.getIntents(message, context)
  .then(intents => resolve(intents))
  .catch(err => reject(err))*/

}


export function chooseResponse(message, context, intents, overrideIntent) {
  // hardcode some commands in here
  return new Promise(function(resolve, reject) {
    var switchConfidence = 0.7;
    var response = context;
    var best = false; // should really cycle and choose highest intent -- FIX LATER
    var overwrite = false;

    if(intents && intents.outcomes){
      best = intents.outcomes[0];
    }

    console.log('CHOOSING FROM INTENTS')
    console.log(intents)

    if(overrideIntent){
      // override intent
      response = overrideIntent;
    } else if (!response.intent || (switchConfidence && best.confidence >= switchConfidence)) {
      // if there's no intent or there's a high confidence in guessed intent, switch
        response.intent = best.intent;
        response.entities = best.entities;
        response = mergeEntities(response, best.entities, false)
    } else if (best.intent == response.intent) {
      // if the intents match, merge them but adopt new entities --< MAY WANT TO NOT ADOPT NEW ENTITIES
      response = mergeEntities(response, best.entities, true)
    } else {
      // otherwise, just adopt previously unknown entities and hope they fill in gaps
      response = mergeEntities(response, best.entities, false)
    }
    response.message = message;
    console.log('MERGED RESPONSE:');
    console.log(response);
    resolve(response);
  })
}

function mergeEntities(response, entities, overwrite) {
  var merged = response;
  if(!merged.entities){
    merged.entities = {};
  }
  for (var key in entities) {
    if (entities.hasOwnProperty(key)) {
      if (overwrite === true || !merged.entities[key]) {
        merged.entities[key] = entities[key];
      }
    }
  }
  return merged;
}
