'use strict';

import Conversation from './conversation.model';
var Promise = require('bluebird');

export function getById(id) {
  return new Promise(function(resolve, reject) {
    Conversation.findById(id).exec()
      .then(convo => resolve(convo))
      .catch(err => reject(err))
  })
}

export function getByStepId(stepId, conversation) {
  return new Promise(function(resolve, reject) {
    if(conversation){
      resolve(conversation);
    } else {
      Conversation.findOne({
          steps: {
            $elemMatch: {
              '_id': stepId
            }
          }
        }).exec()
        .then(convo => {
          if (!convo) {
            reject('No convo found with id ' + stepId);
          }
          resolve(convo);
        })
        .catch(err => reject(err))
    }
  })
}

export function getStep(stepId, conversation) {
  return new Promise(function(resolve, reject) {
    if (!conversation) {
      reject('No conversation provided.')
    }
    for (var i = 0; i < conversation.steps.length; i++) {
      var step = conversation.steps[i];
      if (step._id == stepId) {
        resolve(step);
        return;
      }
    }
    reject('Couldn\'t find step with id ' + stepId + ' in provided conversation.');
  })
}

export function getByIntent(intent) {
  return new Promise(function(resolve, reject) {
    console.log('Getting conversation for intent ' + intent);
    Conversation.findOne({
        'intent': intent
      }).exec()
      .then(convo => {
        if (!convo) {
          reject('No convo for intent ' + intent);
        }
        resolve(convo);
      })
      .catch(err => reject(err))
  })
}
