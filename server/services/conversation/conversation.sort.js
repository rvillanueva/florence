'use strict';
var Interpreter = require('../interpreter');
var Promise = require('bluebird');

export function selectExecuteStep(bot) {
  return new Promise(function(resolve, reject){
    getRefs(bot)
      .then(bot => filterRefsByCondition(bot))
      .then(bot => getStepsFromRefs(bot))
      .then(bot => sortStepsByType(bot)) // If no step, should do nothing and unload step
      .then(bot => handleExecutables(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function getIntentSteps(bot) {
  // returns steps that are intents
  return new Promise(function(resolve, reject){
    getRefs(bot)
      .then(bot => filterRefsByCondition(bot))
      .then(bot => getStepsFromRefs(bot))
      .then(bot => sortStepsByType(bot))
      .then(bot => {
        bot.cache.steps = bot.cache.sorted.intents;
        resolve(bot);
      })
  })
}

function getRefs(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Getting refs...')
    var refs = [];
    if (bot.loaded.step) {
      bot.cache.refs = bot.loaded.step.next;
    } else {
      console.log('ERROR: No loaded step.')
    }
    // build conditions TODO
    resolve(bot);
  })
}
// Filter out refs that don't match given conditions
function filterRefsByCondition(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Filtering refs...')
    resolve(bot);
  })
}

function getStepsFromRefs(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Getting steps from refs...')
    var steps = []
    bot.cache.refs = bot.cache.refs || [];
    bot.cache.refs.forEach((ref, r) => {
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
    bot.cache.steps = steps;
    resolve(bot);
  })
}

function sortStepsByType(bot){
  return new Promise(function(resolve, reject){
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


function handleExecutables(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.cache.sorted.executables.length > 0) {
      //set to executing
      selectStep(bot, bot.cache.sorted.executables)
        .then(step => loadStep(bot, step))
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    } else if (bot.cache.sorted.intents.length > 0) {
      setWaiting(bot)
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    } else {
      setDone(bot)
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    }
  })
}

export function selectIntents(bot, steps) {
  return new Promise(function(resolve, reject) {
    var returned = [];
    console.log('Selecting steps by intent...');
    // CHECK AGAINST REF RULE MATCHES
    if(steps && steps.length > 0){
      var matched = Interpreter.checkSteps(bot, steps)
      returned.push(matched); // TODO clean up array issue--should it return more than one match?
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
      // Set ended.
      bot.loaded.step = false;
      bot.state.step.id = false;
      resolve(bot);
    }
  });
}

function setWaiting(bot, intents){
  return new Promise(function(resolve, reject) {
    // TODO set expected intents;
    bot.loaded.step = false;
    resolve(bot);
  })
}

function setDone(bot, intents){
  return new Promise(function(resolve, reject) {
    // TODO set expected intents;
    bot.loaded.step = false;
    bot.state.step.id = null;
    resolve(bot);
  })
}
