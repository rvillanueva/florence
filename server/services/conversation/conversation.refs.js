'use strict';

var Promise = require('bluebird');

export function getSteps(bot) {
  return new Promise(function(resolve, reject) {
    get(bot)
      .then(bot => filterByCondition(bot))
      .then(bot => convertToSteps(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function get(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Getting refs...')
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
export function filterByCondition(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Filtering refs...')
    resolve(bot);
  })
}

export function convertToSteps(bot) {
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
