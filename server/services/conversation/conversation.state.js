'use strict';

var Store = require('./conversation.store');


export function setNextStep(bot, ref){
  return new Promise(function(resolve, reject) {
    if(!ref){
      // if no ref (only intents and fallback), set status to waiting
      setWaiting(bot, intents)
      .then(() => resolve(false))
    }
    if(ref.type == 'step'){
      bot.setStep(ref.refId)
      .then(bot => resolve(bot))
    } else if (ref.type == 'conversation'){
      bot.divert(ref.refId)
      .then(bot => resolve(bot))
    }
  })
}

//set status to waiting and set expected 'entity-state' with expected intents
function setWaiting(bot, intents){
  return new Promise(function(resolve, reject) {
    bot.state.status = 'waiting';
    resolve(false);
  })
}


export function setNextState(bot, next){
  return new Promise(function(resolve, reject){
    bot.state.intent = null;
    if(bot.state.status == 'running'){
      if (next && next.action == 'retry') {
        bot.state.status = 'retrying';
      } else {
        bot.state.entities = {};
        bot.state.needed = [];
        bot.state.retries = 0;
        if (next && next.action == 'goTo') {
          bot.state.stepId = next.stepId;
        } else if (bot.state.returnStepId) {
            bot.state.stepId = bot.state.returnStepId;
        } else {
          // Needs to set next step for finished conversation TODO
          bot.state.stepId = null;
          bot.state.status = 'paused';
        }
      }
    }
    console.log('BOT STATUS: ' + bot.state.status)
    bot.updateState()
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function setIntentState(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.intent) {
      Store.getStepIdByIntent(bot.state.intent)
        .then(stepId => {
              if (!stepId) {
                resolve(bot);
              }
              bot.state.status = 'running';
              bot.state.intent = null;
              bot.state.entities = {};
              bot.state.needed = [];
              bot.state.retries = 0;
              console.log('INTENTING...')
              console.log(bot.state)
          if (bot.state.returnStepId) {
            bot.state.returnStepId = bot.state.stepId;
            bot.state.stepId = stepId;
            bot.updateState()
              .then(bot => resolve(bot))
          } else {
            bot.state.stepId = stepId;
            bot.updateState()
              .then(bot => resolve(bot))
          }
        })
        .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}
