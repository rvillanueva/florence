'use strict';

var Promise = require('bluebird');

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function run(bot){
  return new Promise(function(resolve, reject){
    var text;
    console.log('running')
    console.log(bot.task)
    console.log(bot.stepIndex)
    if(bot.task.steps[bot.stepIndex].speech){
      text = bot.task.steps[bot.stepIndex].speech.text
    }
    if(bot.task.steps[bot.stepIndex].question){
      text = bot.task.steps[bot.stepIndex].question.text
      bot.state.status = 'waiting';
      bot.state.active.taskId = bot.task._id;
      bot.state.active.stepId = bot.task.steps[bot.stepIndex]._id;
    }
    console.log(text)
    bot.send({
      text: text
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function loadNextStep(bot){
  return new Promise(function(resolve, reject){

  })
}

export function handleQuestion(bot){
  return new Promise(function(resolve, reject){
  })
}

export function handleAction(bot){
  return new Promise(function(resolve, reject){
  })
}

export function handleSpeech(bot){
  return new Promise(function(resolve, reject){
  })
}

export function handleEnd(bot){
  return new Promise(function(resolve, reject){
  })
}
