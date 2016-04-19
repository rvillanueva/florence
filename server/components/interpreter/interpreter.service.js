'use strict';

var Wit = require('./wit');
var Aspects = require('../aspects');
var Promise = require('bluebird');

export function getIntents(message, context, skip) {
  // if intent = trigger, skip Wit. otherwise, interpret intent & actions
  return new Promise(function(resolve, reject) {
    console.log('Parsing intent and entities...')
    if (skip) {
      resolve(skip)
    } else {
      if(message.text){
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
      } else {
        // This is a stupid way to handle intent resolution without message text FIX ME
        resolve([
        {
          intent: context.intent
        }])
      }
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
    response.postback = message.postback;
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

export function convertAspectKey(response){
  return new Promise(function(resolve, reject){
    if(response.entities && response.entities.aspectKey){
      Aspects.getByKey(response.entities.aspectKey)
      .then(aspect => {
        if(!aspect){
          console.log('Error: No matching aspect exists for \'' + response.entities.aspectKey + '\'')
        } else {
          entities.aspectId = aspect._id;
        }
        resolve(response);
      })
      .catch(err => reject(err))
    } else {
      resolve(response);
    }
  })
}

export function convertButtonPayload(response){
  return new Promise(function(resolve, reject){
    console.log('CONVERTING BUTTON PAYLOAD');
    //EXPECTED FORMAT
    // BTN_intent_{entities}_buttonCode
    // INIT_intent_{entities}_buttonCode
    if(!response.entities){
      response.entities = {};
    }
    console.log(response);
    if(response.message.postback){
      var payload = response.message.postback;
      var intentEndLoc;
      var buttonValueStartLoc;
      var newEntities;
      if(typeof payload == 'string'){
        if(payload.slice(0,4) == 'BTN_'){
          response.input = 'messengerBtn';
          payload = payload.slice(4)
        }
        if(payload.slice(0,5) == 'INIT_'){
          response.input = 'sendToMessengerBtn';
          payload = payload.slice(5);
        } else {
          resolve(response)
        }
        intentEndLoc = payload.indexOf('_');
        if(intentEndLoc > -1){
          response.intent = payload.slice(0, intentEndLoc);
          payload = payload.slice(intentEndLoc + 1);
        } else {
          resolve(response);
        }
        buttonValueStartLoc = payload.indexOf('_');
        if(buttonValueStartLoc || buttonValueStartLoc === 0){
          response.entities.buttonValue = payload.slice(buttonValueStartLoc + 1, payload.length);
          payload = payload.slice(0,buttonValueStartLoc);
        } else {
          resolve(response)
        }
        console.log('ENTITIES FROM BTN')
        console.log(payload)
        if(payload.length > 0){
          newEntities = JSON.parse(payload);
          // need to check if valid JSON
          if(typeof newEntities == 'object'){
            mergeEntities(response, newEntities, true)
          }
        }
        resolve(response)
      }
    } else {
      resolve(response)
    }
  })
}
