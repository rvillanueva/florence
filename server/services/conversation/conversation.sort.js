'use strict';
var Promise = require('bluebird');

export function stepsByType(bot){
  return new Promise(function(resolve, reject){
    console.log('Sorting steps by type...')
    var sorted = {
      intents: [],
      executables: []
    }
    var steps = bot.cache.steps;
    steps.forEach((step, s) => {
      if (step.type == 'intent' || step.type == 'fallback') {
        sorted.intents.push(step);
      } else {
        sorted.executables.push(step);
      }
    })
    bot.cache.sorted = sorted;
    resolve(bot);
  })
}

export function byIntentType(bot){
  console.log('Sorting intents by type...')
  return new Promise(function(resolve, reject){
    bot.cache.steps = bot.cache.sorted.intents;
    var sorted = {
      matched: [],
      fallback: [],
      global: []
    }
    bot.cache.intents.forEach(function(intent, i){
      bot.cache.steps.forEach(function(step, s){
        if (step.intentId == intent._id){
          sorted.matched.push(step);
        }
      })
      if(intent.global && intent.conversationId){
        sorted.global.push(intent)
      }
    })
    bot.cache.sortedIntents = sorted;
    resolve(bot)
    // Cycle through intents and see if any match the steps
  })
}
