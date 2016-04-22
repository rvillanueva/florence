'use strict';
var Promise = require('bluebird');
import * as VerifyService from './verify.service';
import Verification from '../../api/verification/verification.model';


export function verify(provider, profile, userId, token) {
  return new Promise(function(resolve, reject) {
    VerifyService.findVerification(userId, provider)
      .then(verification => {
        if (!verification) {
          VerifyService.createVerification(provider, profile, null)
            .then(verification => {
              var data = {
                user: null,
                reason: 'noUser',
                vId: verification._id,
                token: verification.token
              }
              resolve(data)
            })
            .catch(err => reject(err))
        } else {
          VerifyService.checkToken(verification, token)
          .then(verification => {
            if(!verification){
              resolve(null);
            } else {
              return VerifyService.completeVerification(verification, profile, userId);
            }
          })
          .then(user => {
            if (!user) {
              resolve(null);
            } else {
              resolve({
              user:user
            });
            }
          })
          .catch(err => reject(err))
        }
      })
      .catch(err => reject(err))
  })
}

export function verifyByButton(vId, token, userId){
  return new Promise(function(resolve, reject){
    VerifyService.findVerificationById(vId)
      .then(verification => checkToken(verification, token))
      .then(verification => {
        if(verification){
          verification.userId = userId;
          return verification.save();
        } else {
          return resolve(null)
        }
      })
      .then(completeVerification(verification, token))
      .then(user => resolve(true))
      .catch(err => reject(err))
  })
}

export function getToken(userId){
  return new Promise(function(resolve, reject){
    VerifyService.createVerification('facebook', null, userId)
    .then(verification => resolve(verification))
    .catch(err => reject(err))
  })
}
