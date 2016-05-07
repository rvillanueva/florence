'use strict';
var Interpreter = require('../interpreter');
var Promise = require('bluebird');

export function selectExecuteStep(bot) {
  return new Promise(function(resolve, reject){
    getRefs(bot)
      .then(refs => filterRefsByCondition(bot, refs))
      .then(refs => getStepsFromRefs(bot, refs))
      .then(steps => filterByStepType(bot, steps, 'executable')) // FIXME need to handle only intents remaining
      .then(steps => selectStep(bot, steps))
      .then(step => loadStep(bot, step))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function selectIntentStep(bot) {
  return new Promise(function(resolve, reject){
    getRefs(bot)
      .then(refs => filterRefsByCondition(bot, refs))
      .then(refs => getStepsFromRefs(bot, refs))
      .then(steps => filterByStepType(bot, steps, 'intent'))
      .then(steps => selectIntents(bot, steps))
      .then(steps => selectStep(bot, steps))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

function getRefs(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Getting refs...')
    var refs = [];
    if (bot.loaded.step) {
      refs = bot.loaded.step.next;
    } else {
      console.log('ERROR: No loaded step.')
    }
    // build conditions TODO
    resolve(refs);
  })
}
// Filter out refs that don't match given conditions
function filterRefsByCondition(bot, refs) {
  return new Promise(function(resolve, reject) {
    console.log('Filtering refs...')
    resolve(refs);
  })
}

function getStepsFromRefs(bot, refs) {
  return new Promise(function(resolve, reject) {
    console.log('Filtering refs...')
    var steps = []
    refs = refs || [];
    refs.forEach((ref, r) => {
      var found = false;
      bot.loaded.conversation.steps.forEach((step, s) => {
        if (ref.stepId == step._id) {
          step.weight = ref.weight;
          steps.push(step);
          found = true;
        }
      })
      if (!found) {
        console.log('No step found for ref with stepId ' + ref.stepId)
      }
    })
    resolve(steps);
  })
}

function filterByStepType(bot, steps, type) {
  return new Promise(function(resolve, reject) {
    var returned = [];
    steps.forEach((step, s) => {
      // TODO need to handle non-intent and non-executable
      if (type == 'intent' && step.type == 'intent') {
        returned.push(step)
      } else if (type == 'executable') {
        returned.push(step)
      }
    })
    resolve(returned);
  })

}

export function selectIntents(bot, steps) {
  return new Promise(function(resolve, reject) {
    var returned = [];
    console.log('Selecting steps by intent...');
    // CHECK AGAINST REF RULE MATCHES
    if(steps && steps.length > 0){
      returned = Interpreter.checkRefs(bot, steps)
    }
    resolve(returned);
  })
}

export function selectStep(bot, steps) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting step to execute...');
    if(steps && steps.length > 0){
      var index = Math.floor(Math.random() * steps.length)
        // CHOOSE STEP BASED ON WEIGHT TODO;
      resolve(steps[index]);
    } else {
      resolve(false)
    }
  });
}

function loadStep(bot, step){
  return new Promise(function(resolve, reject) {
    if(step){
      bot.setStep(step._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      bot.loaded.step = false;
      resolve(bot);
    }
  });
}
