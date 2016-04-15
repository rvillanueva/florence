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

var router = function(action){
  return {
    hello: General.hello(),
    logScore: Measures.addScore(),
    logTrigger: Measures.logTrigger(),
    unsubscribe: false,
    engageMore: false,
    engageLess: false
  }
}

export function respond(conversation, action){
  return new Promise(function(resolve, reject){
    var route = router[action.intent];
    if(route && route().respond){
      route(conversation).respond(action)
      .then(resolve(true))
      .catch(err => reject(err))
    } else {
      reject('No matching intent found.')
    }
  })
}

export function init(conversation){
  return new Promise(function(resolve, reject){
    var route = router[action.intent];
    if(route && route().respond){
      route(conversation).init()
      .then(resolve(true))
      .catch(err => reject(err))
    } else {
      reject('No matching intent found.')
    }
  })
}
