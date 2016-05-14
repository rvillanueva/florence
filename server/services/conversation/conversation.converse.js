'use strict';

var Sort = require('./conversation.sort');
var Actions = require('../actions');
var Refs = require('./conversation.refs');

export function run(bot){
  return new Promise(function(resolve, reject){
    executeStep(bot)
      .then(bot => Refs.get(bot))
      .then(bot => Refs.filterByCondition(bot))
      .then(bot => Refs.convertToSteps(bot))
      .then(bot => Sort.stepsByType(bot))
      .then(bot => setNext(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}


export function executeStep(bot) {
  return new Promise(function(resolve, reject) {
    console.log('\n\n\n\nRunning new step...')
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


function setNext(bot) {
    if (bot.cache.sorted.executables.length > 0) {
      return selectStep(bot, bot.cache.sorted.executables)
    } else if (bot.cache.sorted.intents.length > 0) {
      return setWaiting(bot)
    } else {
      return setDone(bot)
    }
}

export function selectStep(bot, steps) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting step to execute...');
    if(steps && steps.length > 0){
      var index = Math.floor(Math.random() * steps.length)
      // CHOOSE STEP BASED ON WEIGHT TODO;
      bot.state.status = 'conversing';
      bot.setStep(steps[index]._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      // Set ended.
      setDone(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    }
  });
}

function setWaiting(bot, intents){
  return new Promise(function(resolve, reject) {
    // TODO set expected intents;
    bot.state.status = 'waiting';
    resolve(bot);
  })
}

function setDone(bot, intents){
  return new Promise(function(resolve, reject) {
    // TODO set expected intents;
    bot.state.status = 'done';
    resolve(bot);
  })
}
