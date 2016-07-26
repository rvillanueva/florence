'use strict';

var Promise = require('bluebird');

var stepRouter = {
  question: handleQuestion,
  speech: handleSpeech
}

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function run(bot){
  return new Promise(function(resolve, reject){
    var text;
    var step = bot.loaded.step
    console.log('running')
    console.log(bot.loaded.task)
    if(!step){
      reject(new Error('No step provided to run.'));
    } else if(typeof stepRouter[step.type] === 'function'){
      stepRouter[step.type](bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      reject(new Error('Unrecognized step type ' + ' for step '))
    }
  })
}

export function handleQuestion(bot){
  return new Promise(function(resolve, reject){
    var text = bot.loaded.step.question.text;
    bot.state.status = 'waiting';
    bot.send({
      text: text
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function handleSpeech(bot){
  return new Promise(function(resolve, reject){
    var text = bot.loaded.task.steps[bot.loaded.stepIndex].speech.text;
    bot.send({
      text: text
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

/*
export function handleAction(bot){
  return new Promise(function(resolve, reject){
  })
}

export function handleEnd(bot){
  return new Promise(function(resolve, reject){
  })
}*/
