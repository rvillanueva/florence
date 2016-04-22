'use strict';
var Promise = require('bluebird');
import * as VerifyService from './verify.service';


export function verify(provider, profile, userId, token) {
  // should return user, reason, vData

  // Get verification
  // If there isn't one, create one. Resolve no user with reason 'noUser'
  // If there is one, continue
  // Do the userId and token match verification? If so, merge verification and user and return user
  // If they don't match, send a new verification and resolve no user with reason 'expired token'
  return new Promise(function(resolve, reject) {
    VerifyService.findVerification(userId, provider)
      .then(verification => {
        if (!verification) {
          VerifyService.createVerification(provider, profile)
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
          .then(user => {
            if (!user) {
              resolve(null, 'expiredToken');
            }
          })
          .catch(err => reject(err))
        }
      })
      .catch(err => reject(err))
  })
}
