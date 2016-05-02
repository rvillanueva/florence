'use strict';

import Conversation from '../../api/conversation/conversation.model'

export function getStepIdByIntent(intent) {
  return new Promise(function(resolve, reject) {
    var stepId;
    if (intent == 'intro') {
      stepId = '5726c7b47721d48e5c52f887'
    } else if(intent == 'hello') {
      stepId = '5726c7b47721d48e5c52f887'
    } else {
      console.log('error: why are we getting random intents? ' + intent)
      reject('Random intent.')
    }
    Conversation.findOne({steps: {$elemMatch: {'_id': stepId}}}).exec()
    .then(convo => {
      if (!convo){
        reject('No step found with id ' + stepId);
      }
      resolve(convo.steps[0]._id);
    })
    .catch(err => reject(err))
  })
}

export function getStepById(stepId) {
  return new Promise(function(resolve, reject) {
    console.log('Getting step by id')
    Conversation.findOne({steps: {$elemMatch: {'_id': stepId}}}).exec()
    .then(convo => {
      if(!convo){
        reject('No conversation found.')
      }
      for(var i = 0; i < convo.steps.length; i++){
        var step = convo.steps[i];
        if (step._id == stepId) {
          resolve(step);
        }
      }
      reject('No step found with id ' + stepId);
    })
    .catch(err => reject(err))
  })
}
