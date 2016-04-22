'use strict';

var Promise = require('bluebird');
var moment = require('moment');
import User from '../../api/user/user.model';
import * as Messages from '../messages';
import Verification from '../../api/verification/verification.model';

export function findVerification(userId, provider) {
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


export function createVerification(provider, profile) {
  return new Promise(function(resolve, reject) {
      Verification.create({
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
    if (verification.token && verification.expires && verification.token == token && new Date() < verification.expires) {
      User.findById(verification.userId).exec()
      .then(user => {
        if (!user) {
          reject('No user found')
        }
        if (verification.provider == 'facebook') {
          user.facebook = verification.profile;
          if (profile.picture) {
            user.picture = profile.picture;
          }
          if (!user.email) {
            user.email = profile.emails[0].value;
          }
          user.facebook = profile;
          user.save()
            .then(user => {
              verification.remove()
                .then(res => resolve(user))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        } else {
          reject('Unknown provider')
        }
      })

    } else {
      reject('Verification missing key properties')
    }
  })
}
