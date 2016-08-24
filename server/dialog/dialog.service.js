'use strict';

var Promise = require('bluebird');
var ParserService = require('../components/parser');
var IntentService = require('../components/intent');
var ConditionService = require('../components/condition');

export function classify(bot){
  return new Promise(function(resolve, reject){

    ParserService.classify(bot.message.text)
    .then(parsed => attachParsedtoBot(parsed))
    .catch(err => reject(err))

    function attachParsedToBot(){
      bot.parsed = parsed;
      resolve(bot);
    }
  })
}

export function expireContexts(bot){
  return new Promise(function(resolve, reject){
    // remove expired contexts
  })
}

export function handleSlotFilling(bot){
  return new Promise(function(resolve, reject){
    // fill slot and select intent
  })
}


export function handleNewIntent(bot){
  return new Promise(function(resolve, reject){

    // select relevant intent if not filling slot
    /*
    var contexts = [
      {
        name: string,
        created: Date,
        lifespan: Number,
        parameters: [
          {
            name: key,
            value: string
          }
        ]
      }
    ]
    */
    if(!bot.intentKey && parsed.entities && parsed.entities.intent){
      bot.intentKey = parsed.entities.intent[0].value;
    } else {
      bot.intentKey = 'confused';
    }
    resolve(bot)

  })
}

export function getIntent(bot){
  return new Promise(function(resolve, reject){
    IntentService.getByKey(bot.intentKey)
    .then(intent => {
      if(!intent){
        reject(new Error('No intent returned for intentKey ' + bot.intentKey))
      }
      bot.intent = intent;
      resolve(bot);
    })
    .catch(err => reject(err))
  })
}

export function filterResponses(bot){
  return new Promise(function(resolve, reject){
    // should evaluate each response by conditions and eliminate those that don't fit, leaving only those with missing params or matching
    bot.validResponses = [];
    bot.unvalidatedResponses = [];
  })
}

export function askFollowups(bot){
  return new Promise(function(resolve, reject){
    // should take the next "closest to match" response and ask for an outstanding parameter

  })
}

export function handleResponseExecution(bot){
  return new Promise(function(resolve, reject){
    // if no unvalidated responses remain, execute the valid response that matches the most conditions.
  })
}

export function updateState(bot){
  return new Promise(function(resolve, reject){
    // should save state
  })
}
