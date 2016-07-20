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
    console.log('running')
    console.log(bot.task)
    console.log(bot.stepIndex)
    if(typeof stepRouter[bot.task.steps[bot.stepIndex].type] === 'function'){
      stepRouter[bot.task.steps[bot.stepIndex].type](bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      reject(new Error('Unrecognized step type ' + ' for step '))
    }
  })
}

export function handleQuestion(bot){
  return new Promise(function(resolve, reject){
    var text = bot.task.steps[bot.stepIndex].question.text
    bot.state.status = 'waiting';
    bot.state.active.taskId = bot.task._id;
    bot.state.active.stepId = bot.task.steps[bot.stepIndex]._id;
    bot.send({
      text: text
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function handleSpeech(bot){
  return new Promise(function(resolve, reject){
    var text = bot.task.steps[bot.stepIndex].speech.text;
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
