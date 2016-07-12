'use strict';

var Promise = require('bluebird');

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function handleNextStep(bot){
  return new Promise(function(resolve, reject){
    Message.receive(bot.received)
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
