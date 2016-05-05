'use strict';


export function setNextStep(bot, ref){
  return new Promise(function(resolve, reject) {
    if(!ref){
      // if no ref, set status to waiting, save state, and break cycle
      setWaiting(bot)
      .then(bot => bot.updateState())
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

// Set status to waiting and set expected intents
function setWaiting(bot, intents){
  return new Promise(function(resolve, reject) {
    bot.state.status = 'waiting';
    // Need to set expected intents TODO
    resolve(bot);
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
