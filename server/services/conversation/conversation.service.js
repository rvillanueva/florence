'use strict';

var Matcher = require('./conversation.match');
var Store = require('./conversation.store');

export function startStep(bot, step) {
  return new Promise(function(resolve, reject) {
    bot.state.stepId = step._id;
    bot.updateState()
      .then(res => bot.sayMany(step.data.messages))
      .then(res => waitForResponse(bot, step))
      .then(res => resolve(res))
  })
}

export function respondStep(bot, step) {
  return new Promise(function(resolve, reject) {
    Matcher.checkPaths(bot, step.data.paths)
      .then(map => {
        map = map || {};
        map.step = step;
        return sendReply(bot, map);
      })
      .then(next => runNext(bot, next))
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

export function run(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.intent) {
      Store.getStepByIntent(bot.state.intent)
        .then(step => startStep(bot, step))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else if (bot.state.stepId) {
      Store.getStepById(bot.state.stepId)
        .then(step => respondStep(bot, step))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      Store.getStepByIntent('hello')
        .then(step => startStep(bot, step))
        .then(res => resolve(res))
        .catch(err => reject(err))
    }
  })
}


function runNext(bot, next) {
  return new Promise(function(resolve, reject) {
    bot.state.intent = null;
    bot.state.entities = {};
    bot.state.needed = [];
    if (next && next.action == 'goTo') {
      bot.state.stepId = next.stepId;
      bot.state.retries = 0;
    } else if (next && next.action == 'retry') {
      bot.state.retries = bot.state.retries | 0;
      bot.state.retries++;
    } else {
      if (bot.state.mainStepId) {
        bot.state.stepId = bot.state.returnStepId;
      } else {
        // Needs to set next step for finished conversation TODO
        bot.state.stepId = null;
      }
      bot.state.retries = 0;
    }
    bot.updateState()
      .then(bot => {
        if(bot.state.stepId){
          Store.getStepById(bot.state.stepId)
          .then(step => startStep(bot, step))
          .then(res => resolve(res))
          .catch(err => reject(err))
        } else {
          resolve(false);
        }
      })
  })
}

function waitForResponse(bot, step){
  return new Promise(function(resolve, reject){
    console.log('step')
    console.log(step)
    if(!step.data.paths || step.data.paths.length == 0){
      runNext(bot, step.next)
      .then(res => resolve(res))
      .catch(err => reject(err))
    } else {
      resolve(step)
    }
  })
}

function sendReply(bot, map){ //Handle this better TODO
  return new Promise(function(resolve, reject){
    var next;
    // catch unknown
    if(!map.path || !map.pattern){
      retryStep(bot, map.step)
      .then(next => resolve(next))
      .catch(err => reject(err))
    } else {
      if (!map.path.next || !map.path.next.action || map.path.next.action == 'default') {
        next = map.step.next;
      } else {
        next = map.path.next;
      }
      bot.sayMany(pattern.messages)
      .then(res => resolve(next))
      .catch(err => reject(err))
    }
  })
}

function retryStep(bot, step){
  return new Promise(function(resolve, reject){
    console.log('Retrying...')
    var next = false;
    bot.state.intent = null;
    bot.state.retries = bot.state.retries || 0;
    if(!step.retries ||
      !step.retries.max ||
      bot.state.retries >= step.retries.max
    ){
      console.log('maxed out retries, doing next...')
      bot.state.retries = 0;
      next = step.retries.next;
    } else {
      console.log('didn\'t max out retries yet, trying')
      if(step.retries && step.retries.replies && step.retries.replies[bot.state.retries]){
        bot.say(step.retries.replies[bot.state.retries])
      } else {
        bot.say('Uh oh, not quite sure I understood that....') // should get prebuild replies set, randomized TODO
      }
      bot.state.retries ++;
    }
    bot.updateState()
    .then(res => resolve(next))
    .catch(err =>reject(err))
  })
}
