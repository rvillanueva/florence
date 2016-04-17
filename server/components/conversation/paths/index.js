'use strict';

var Promise = require('bluebird');
var Measures = require('./measures');
var General = require('./general')

var router = function(conversation, response){
  return {
    hello: General.hello(conversation, response),
    chooseOutcome: General.chooseOutcome(conversation, response),
    addScore: Measures.addScore(conversation, response),
    addTriggers: Measures.addTriggers(conversation, response),
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
