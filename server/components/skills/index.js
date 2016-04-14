'use strict';

var Promise = require('bluebird');

/*

Intents:

addScore
addTrigger
startConversation
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

var actionMap = function(action){
  return {
    logScore: Measures.addScore(action),
    logTrigger: Measures.logTrigger(action),
    unsubscribe: false,
    engageMore: false,
    engageLess: false
  }
}

export function mapIntent(action){
  return new Promise(function(resolve, reject){
    if(actionMap[action.intent]){
      actionMap[action.intent](action);
      resolve(true);
    } else {
      reject('No matching intent found.')
    }
  })

}
