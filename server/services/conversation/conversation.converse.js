'use strict';

var Actions = require('../actions');
var Refs = require('./conversation.refs');
var Load = require('./conversation.load');

export function run(bot){
  return new Promise(function(resolve, reject){
    executeStep(bot)
      .then(bot => Refs.getSteps(bot))
      .then(bot => Load.step(bot))
      .then(bot => Load.set(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}


export function executeStep(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Running new step...')
    executeStepByType(bot)
      .then(bot => Actions.execute(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })

  function executeStepByType(bot) {
    console.log('Executing step with type ' + bot.loaded.step.type);
    var types = {
      say: () => {
        return bot.say(bot.loaded.step.text);
      },
      intent: () => {
        // Stash any entities identified from received message
      },
      buttons: () => {
        console.log('Do buttons here.')
      },
      fallback: () => {
        //do fallback stuff
      },
      container: () => {
        //is just a container, no action
      }
    }

    return new Promise(function(resolve, reject){
      if(!types[bot.loaded.step.type]){
        reject('Unknown step type.')
      }
      types[bot.loaded.step.type]();
      console.log('Doing step...')
      resolve(bot);
    })

  }
}
