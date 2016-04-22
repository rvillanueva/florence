'use strict';

var Promise = require('bluebird');
var moment = require('moment');
import User from '../../api/user/user.model';
import * as Messages from '../messages';
import Verification from '../../api/verification/verification.model';

export function findVerification(userId, provider) {
  console.log(userId)
  console.log(provider)
  return new Promise(function(resolve, reject) {
    if (!userId) {
      resolve(null)
    }
    Verification.findOne({
        'userId': userId,
        'provider': provider
      }).exec()
      .then(verification => resolve(verification))
      .catch(err => reject(err))
  })
}

export function createVerification(provider, profile, userId) {
  return new Promise(function(resolve, reject) {
      Verification.create({
          'userId': userId,
          'provider': provider,
          'profile': profile
        })
        .then(verification => generateToken(verification))
        .then(verification => resolve(verification))
        .catch(err => reject(err))
  })
}

export function generateToken(verification){
  return new Promise(function(resolve, reject) {
      verification.token = 'generated';
      verification.expires = moment().add(1, 'hours').toDate();
      verification.save()
        .then(verification => resolve(verification))
        .catch(err => reject(err))
  })
}

export function checkToken(verification, token) {
  // needs user, provider, token, and expires
  return new Promise(function(resolve, reject) {
    console.log(verification)
    console.log(token)
    if (verification.token && verification.expires && verification.token == token && new Date() < verification.expires) {
      resolve(verification);
    } else {
      resolve(false);
    }
  })
}

export function completeVerification(verification, profile, userId){
  return new Promise(function(resolve, reject){
    console.log('resolving user')
    User.findById(verification.userId).exec()
    .then(user => {
      if (!user) {
        reject('No user found')
      }
      if (verification.provider == 'facebook') {
        user.facebook = profile;
        if (profile.picture) {
          user.picture = profile.picture;
        }
        if (!user.email) {
          user.email = profile.emails[0].value;
        }
        user.facebook = profile;
        console.log('USER')
        console.log(user)
        user.save()
          .then(user => {
            verification.remove()
              .then(res => {
                console.log(user)
                resolve(user)
              })
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      } else {
        reject('Unknown provider')
      }
    })
  })
}

export function checkVerificationById(vId) {
  return new Promise(function(resolve, reject) {
    Verification.findById(vId).exec()
    .then(verification => resolve(verification))
    .catch(err => reject(err))
  })
}
