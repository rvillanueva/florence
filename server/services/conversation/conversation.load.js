'use strict';
var Promise = require('bluebird');
var Conversation = require('../../api/conversation/conversation.service');

export function set(bot){
  return new Promise(function(resolve, reject){
    console.log('Loading step...')
    console.log(bot.loaded.next);
    // TODO what if there are more than one matched step?
    if(!bot.loaded.next || bot.loaded.next.type == 'next'){
        bot.state.status = 'next';
        bot.state.current = null;
        resolve(bot);

    } else if(bot.loaded.next.type == 'step'){
      bot.state.status = 'conversing';
      bot.set(bot.loaded.next)
      .then(bot => resolve(bot))
      .catch(err => reject(err))

      // Otherwise, if a global intent matches, divert. TODO only do this if urgent
    } else if (bot.loaded.next.type == 'diversion'){
      bot.state.status = 'conversing';
      bot.divert({
        type: 'step',
        stepId: bot.loaded.next.stepId
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))

    } else if (bot.loaded.next.type == 'checkin'){
      bot.state.status = 'checkin';
      bot.set(bot.loaded.next)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else if (bot.loaded.next.type == 'wait'){
      bot.state.status = 'waiting';
      resolve(bot)
    } else if (bot.loaded.next.type == 'confused'){
      if(bot.state.current){
        bot.state.status = 'waiting';
      } else {
        bot.state.status = 'done';
      }
      bot.confused()
      .then(() => resolve(bot))
      .catch(err => reject(err))
    } else {
      reject(new TypeError('Unrecognized loaded type ' + bot.loaded.type));
    }
  })
}

export function step(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Sorting steps by type...')
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
    if (sorted.executables.length > 0) {
      bot.loaded.next = {};
      selectStep(bot, sorted.executables)
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    } else if (sorted.intents.length > 0) {
      bot.loaded.next = { type: 'wait'};
      resolve(bot);
    } else {
      bot.loaded.next = null;
      resolve(bot);
    }

  })
}


export function selectStep(bot, steps) {
  return new Promise(function(resolve, reject) {
    if (!steps || steps.length == 0) {
      reject('Need steps to execute.')
    }

    console.log('Setting step to execute...');
    var index = Math.floor(Math.random() * steps.length)
      // CHOOSE STEP BASED ON WEIGHT TODO;
    bot.loaded.next = {
      type: 'step',
      stepId: steps[index]._id
    }
    bot.loaded.step = steps[index];
    resolve(bot);

  });
}


export function intentStep(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Sorting intents by type...')
    var sorted = {
      local: [],
      fallback: []
    }

    bot.cache.intents.forEach(function(intent, i) {
      bot.cache.steps.forEach(function(step, s) {
        if (step.intentId == intent._id) {
          if(step.type == 'fallback'){
            sorted.fallback.push(step);
          } else {
            sorted.local.push(step);
          }
        }
      })
    })
    if (sorted.local.length > 0) {
      bot.loaded.next = {
        type: 'step',
        stepId: sorted.local[0]._id
      }
      bot.loaded.step = sorted.local[0];
      resolve(bot)
    } else if (sorted.fallback.length > 0) {
      bot.loaded.next = {
        type: 'step',
        fallback: true,
        stepId: sorted.fallback[0]._id
      }
      bot.loaded.step = sorted.fallback[0];
      resolve(bot);
    } else {
      bot.loaded.next = null;
      resolve(bot)
    }
    // Cycle through intents and see if any match the steps
  })
}
