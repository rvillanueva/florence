'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');
var Ref = require('./conversation.ref');

export function getResponse(bot) {
  return new Promise(function(resolve, reject) {
    bot.state.status = 'receiving';
    var step;
    Ref.selectIntentStep(bot)
      .then(step => setStepOrMatchGlobal(bot, step))
      .then(bot => resolve(bot))


    /*}
    if(bot.state.step.id){

      // checkLocalIntents() (can override global intents)
      // if found, setStep()

      // checkGlobalIntents()
      // if didn't find and you find here, divert()

      // run()
      else {
      matchGlobalIntents(bot)
      .then(bot => resolve(bot))
      // checkGlobalIntents()
      // if greeting ->
      // chooseNextConversation()
      // load conversation
      // chamber first step of conversation
      // run()
      resolve(bot)
    }*/
  })
}

function setStepOrMatchGlobal(bot, step) {
  // Should return bot
  return new Promise(function(resolve, reject) {
    if (!step || step.type == 'fallback') {
      Interpreter.matchGlobalIntents(bot)
        .then(convo => {
          if (!convo) {
            setStep(bot, step)
              .then(bot => resolve(bot))
              .catch(err => reject(err))
          } else {
            bot.divert(convo)
              .then(bot => resolve(bot))
              .catch(err => reject(err))
          }

        })
    } else {
      setStep(bot, step)
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    }
  })
}

function setStep(bot, step) {
  return new Promise(function(resolve, reject) {
    if (step) {
      bot.setStep(bot)
        .then(bot => resolve(bot))
    } else {
      bot.say('Sorry, I didn\'t understand. Can you try again?') // Handle confusion better
      resolve(bot);
    }
  })
}

function setStatus(bot, steps) {
  return new Promise(function(resolve, reject) {
    console.log('Setting status...')
    if (bot.state.status == 'receiving') {
      resolve(bot);
    } else {
      if (executables.length > 0) {
        bot.state.status = 'executing';
      } else if (intents.length > 0) {
        bot.state.status = 'waiting';
      } else {
        bot.state.status = 'done';
      }
      resolve(bot);
    }
  })
}

function loadStep(bot, step) {
  return new Promise(function(resolve, reject) {
    bot.setStep(step._id)
      .then(() => resolve(bot))
      .catch(err => reject(err))
  })
}
