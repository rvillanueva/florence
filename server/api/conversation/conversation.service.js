'use strict';

import Conversation from './conversation.model';
var Promise = require('bluebird');

export function getById(id){
  return new Promise(function(resolve, reject){
    Conversation.findById(id).exec()
    .then(convo => resolve(convo))
    .catch(err => reject(err))
  })
}

export function getByStepId(stepId){
  Conversation.findOne({steps: {$elemMatch: {'_id': stepId}}}).exec()
  .then(convo => {
    if (!convo){
      reject('No convo found with id ' + stepId);
    }
    resolve(convo);
  })
  .catch(err => reject(err))
}

export function getStep(stepId, conversation){
  return new Promise(function(resolve, reject){
    if(conversation){
      for(var i = 0; i < conversation.steps.length; i++){
        var step = conversation.steps[i];
        if(step._id == stepId){
          resolve(step);
          return;
        }
      }
      reject('Couldn\'t find step with id ' + stepId + ' in provided conversation.');
    } else {
      reject('No conversation provided.')
    }

  })
}
