'use strict';
var Promise = require('bluebird');
import * as VerifyService from './verify.service';

export function createVerification(provider, profile, userId){
  return new Promise(function(resolve, reject){
    if(provider === 'facebook' && profile){
      VerifyService.getVerification(provider, profile, userId)
      .then((verification, refreshed) => VerifyService.generateNewToken(verification))
      .then(verification => VerifyService.sendVerification(verification))
      .then(refreshed => resolve(refreshed))
      .catch(err => reject(err))
    } else {
      console.log('No provider or profile.')
      reject('No provider or profile.')
    }
  })
}

export function getVerificationLink(){

}

export function checkFacebookAuth(provider, profile, userId, token){
  // Returns user & info
  var verification;
  VerifyService.checkIfUser(provider, profile)
  .then(user => {
    if(user){
      resolve(user);
    } else {
      return VerifyService.findVerification(provider, userId, token)
    }
  })
  .then(verification => {
    return VerifyService.validate(verification, profile, userId, token)
  })
  .then((user, reason) => {
    if(!user){
      resolve(null, {reason: reason})
    }
    resolve(user)
  })
  .catch(err => reject(err))
}
