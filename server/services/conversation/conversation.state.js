'use strict';

var Store = require('./conversation.store');

export function setNextState(bot, next){
  return new Promise(function(resolve, reject){
    console.log('MY BOT STATE IS')
    console.log(bot.state)
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
    console.log('SETTING BOT STATE')
    console.log(bot.state)
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
              console.log(stepId)
              console.log(bot.state)
          if (bot.state.returnStepId) {
            bot.state.returnStepId = bot.state.stepId;
            bot.state.stepId = stepId;
            bot.updateState()
              .then(bot => resolve(bot))
          } else {
            console.log('Updating bot state...')
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
