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

var router = function(conversation){
  return {
    hello: General.hello(conversation),
    logScore: Measures.logScore(conversation),
    logTrigger: Measures.logTrigger(conversation),
    unsubscribe: false,
    engageMore: false,
    engageLess: false
  }
}

export function route(conversation, response){
  return new Promise(function(resolve, reject){
    console.log('response:')
    console.log(response)
    var path = function(conversation){
      return router(conversation)['logScore'];
    }
    if(path && path().respond){
      path(conversation).respond(response)
      .then(res => resolve(res))
      .catch(err => reject(err))
    } else {
      reject(new Error('No matching intent found.'))
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
      reject(new Error('No matching intent found.'))
    }
  })
}
