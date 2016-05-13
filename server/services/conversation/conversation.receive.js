'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');
var Sort = require('./conversation.sort');
var Conversation = require('../../api/conversation/conversation.service');

export function getResponse(bot) {
  return new Promise(function(resolve, reject) {
    bot.state.status = 'receiving';
    var intents;
    Interpreter.getEntities(bot)
    .then(bot => Interpreter.getIntents(bot))
    .then(bot => Sort.getIntentSteps(bot))
    .then(bot => loadStepByIntent(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function loadStepByIntent(bot){
  return new Promise(function(resolve, reject){
    var matchedSteps = [];
    var fallbackSteps = [];
    var globalIntents = [];
    bot.cache.intents.forEach(function(intent, i){
      bot.cache.steps.forEach(function(step, s){
        if (step.intentId == intent._id){
          matchedSteps.push(step);
        }
      })
      if(intent.global && intent.conversationId){
        globalIntents.push(intent)
      }
    })
    console.log(bot.cache.intents);
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
      var helpPhrases = [
        'Uh oh, not sure I understood that one.',
        'Sorry, I\'m still learning... can you try again?',
        'Hey, didn\'t catch that one. Can you try rephrasing?'
      ]
      var phrase = helpPhrases[Math.floor(Math.random()*helpPhrases.length)]
      bot.say(phrase) // TODO Handle confusion better
      resolve(bot)
    }
  })
}
