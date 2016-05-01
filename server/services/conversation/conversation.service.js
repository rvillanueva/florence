'use strict';

var Store = require('./conversation.store');
var Response = require('./conversation.response');
var State = require('./conversation.state');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    // if there's no stepId and there's a main stepId, replace it.
    // handle intent
    console.log('Bot state:')
    console.log(bot.state)
    if (bot.state.intent) {
      State.setIntentState(bot)
        .then(bot => playStep(bot))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      if (bot.state.status == 'retrying') {
        retryStep(bot)
          .then(res => resolve(res))
          .catch(err => reject(err))
      } else if (bot.state.status == 'waiting') {
        respondStep(bot)
          .then(res => resolve(res))
          .catch(err => reject(err))
      } else if(bot.state || bot.state.stepId) {
        playStep(bot)
          .then(res => resolve(res))
          .catch(err => reject(err))
      } else if (bot.state.status !== 'paused'){
        Store.getStepIdByIntent('hello')
        .then(stepId => {
          bot.state.stepId = stepId;
          return playStep(bot);
        })
        .then(res => resolve(res))
        .catch(err => reject(err))
      }
    }
  })
}

export function playStep(bot) {
  return new Promise(function(resolve, reject) {
    // handle no stepid, needs fallback FIXME
    Store.getStepById(bot.state.stepId)
      .then(step => {
        bot.send(step.messages);
        if (step.type == 'choice') {
          bot.state.status = 'waiting';
        } else {
          bot.state.status = 'running';
        }
        console.log(step);
        return State.setNextState(bot, step.next)
      })
      .then(bot => {
        if(bot.state.status == 'running'){
          return run(bot)
        } else {
          resolve(res);
        }
      })
      .then(res => resolve(res))
      .then(res => resolve(res))
  })
}

export function respondStep(bot, step) {
  return new Promise(function(resolve, reject) {
    Store.getStepById(bot.state.stepId)
      .then(step => Response.handle(bot, step))
      .then(bot => run(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

function retryStep(bot, step) {
  return new Promise(function(resolve, reject) {
    Store.getStepById(bot.state.stepId)
      .then(step => {
        if (
          bot.state.status == 'retrying' && !step.retries ||
          !step.retries.max ||
          bot.state.retries >= step.retries.max
        ) {
          next = step.next;
          bot.state.status = 'running';
          State.setNextState(bot, next)
            .then(bot => run(bot))
            .then(res => resolve(res))
            .catch(err => reject(err))
        } else {
          console.log('Retrying...')
          bot.state.retries = bot.state.retries || 0;
          console.log('didn\'t max out retries yet, trying')
          if (step.retries && step.retries.replies && step.retries.replies[bot.state.retries]) {
            bot.say(step.retries.replies[bot.state.retries])
          } else {
            bot.say('Uh oh, not quite sure I understood that....') // should get prebuild replies set, randomized TODO
          }
          bot.state.retries++;
          bot.state.status = 'waiting';
          bot.updateState()
            .then(bot => resolve(bot))
            .catch(err => reject(err))
        }
      })
  })
}
