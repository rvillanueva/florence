'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');
var Ref = require('./conversation.ref');
var Conversation = require('../../api/conversation/conversation.service');
export function getResponse(bot) {
  return new Promise(function(resolve, reject) {
    bot.state.status = 'receiving';
    var intents;
    Interpreter.getIntents(bot.message.text)
    .then(intentData => {
      intents = intentData;
      return Ref.getIntentSteps(bot)
    })
    .then(steps => loadStepByIntent(bot, steps, intents))
    .then(bot => resolve(bot))
  })
}

function loadStepByIntent(bot, steps, intents){
  return new Promise(function(resolve, reject){
    var matchedSteps = [];
    var fallbackSteps = [];
    var globalIntents = [];
      intents.forEach(function(intent, i){
        steps.forEach(function(step, s){
          if (step.intentId == intent._id){
            matchedSteps.push(step);
          }
        })
        if(intent.global){
          globalIntents.push(intent)
        }
      })
    console.log(matchedSteps)
    console.log(fallbackSteps)
    console.log(globalIntents)
    // Cycle through intents and see if any match the steps
    if(matchedSteps.length > 0){ // TODO what if there are more than one matched step?
      bot.setStep(matchedSteps[0]._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else if (globalIntents.length > 0){   // Otherwise, if a global intent matches, divert. TODO only do this if urgent
      Conversation.getById(globalIntents[0].conversationId)
      .then(convo =>  bot.divert(convo))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else if (fallbackSteps.length > 0){   // Otherwise, use fallback
      bot.setStep(fallbackSteps[0]._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else { // otherwise be confused
      bot.say('Uh oh, not sure I understood that one. Can you try again?') // TODO Handle confusion better
      resolve(bot)
    }
  })
}
