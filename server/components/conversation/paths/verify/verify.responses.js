'use strict;'
import * as VerifyComponent from '../../../verify';
var Promise = require('bluebird');

export function verifyByButton(conversation, response){
  // Need: aspectType
  // Optional: link
  return {
    init: (params) => {
      return new Promise(function(resolve, reject){
        if(response.vId && response.token){
          response(params)
          .then(res => resolve(res))
          .catch(err => reject(err))
        } else {
          resolve()
          // Start conversation here
        }
      })
    },
    respond: (params) => {
      return response(params);
    }
  }
  function response(params){
    return new Promise(function(resolve, reject){
      if(!response.vId || !response.token){
        conversation.say('Uh oh, I had some trouble verifying you. Can you try again?');
      }
      VerifyComponent.verifyByButton(response.vId, response.token);
    })
  }
}

export function login(conversation, response){
  // Need: aspectType
  // Optional: link
  return {
    init: (params) => {

    },
    respond: (params) => {
      return new Promise(function(resolve, reject){
        conversation.say('Okay great! Here\'s your info:')
        VerifyComponent.getToken(conversation.userId)
        .then(verification => {
          conversation.buttons(' ', [
            {
              type: 'web_url',
              title: 'View Progress',
              url: 'http://beta.river.ai/auth/facebook?userId' + verification.userId + '&token=' + verification.token
            },
          ])
          resolve();
        })

      })
    }
  }
}
