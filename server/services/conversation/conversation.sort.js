'use strict';
var Interpreter = require('../interpreter');
var Promise = require('bluebird');

export function selectExecuteStep(bot) {
  return new Promise(function(resolve, reject){
      sortStepsByType(bot) // If no step, should do nothing and unload step
      .then(bot => handleExecutables(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function getIntentSteps(bot) {
  // returns steps that are intents
  return new Promise(function(resolve, reject){
    sortStepsByType(bot)
      .then(bot => {
        bot.cache.steps = bot.cache.sorted.intents;
        resolve(bot);
      })
      .catch(err => reject(err))
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
      bot.state.status = 'conversing';
      bot.setStep(step._id)
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
    bot.loaded.step = false;
    resolve(bot);
  })
}

function setDone(bot, intents){
  return new Promise(function(resolve, reject) {
    // TODO set expected intents;
    bot.state.status = 'done';
    bot.loaded.step = false;
    bot.state.step.id = null;
    resolve(bot);
  })
}
