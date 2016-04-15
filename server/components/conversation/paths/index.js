'use strict';

var Promise = require('bluebird');
var Measures = require('./measures');
var General = require('./general')

/*

Intents:

addScore
  measure
addTrigger
  measure
startEntry
  measure (optional)

decreaseEngagement
increaseEngagement
unsubscribe

  Select best intent
  Choose action
  expected intent

  Skill + intent = action
  expected: {
    skill: name,
    intent: name,
    sent: Date
  }
}*/

var router = function(conversation, response){
  return {
    hello: General.hello(conversation, response),
    logScore: Measures.logScore(conversation, response),
    logTriggers: Measures.logTriggers(conversation, response),
    unsubscribe: false,
    engageMore: false,
    engageLess: false
  }
}

export function route(conversation, response){
  return new Promise((resolve, reject) => {
    function path(){
      return router(conversation, response)[response.intent];
    }
    if(path && typeof path().respond == 'function'){
      path(conversation, response).respond()
      .then(res => resolve(res))
      .catch(err => reject(err))
    } else {
      reject(new Error('No matching intent found for ' + response.intent));
    }
  })
}
