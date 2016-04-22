'use strict';

var Promise = require('bluebird');
var moment = require('moment');
import User from '../../api/user/user.model';
import * as Messages from '../messages';
import Verification from '../../api/verification/verification.model';

export function getVerification(provider, profile, userId) {
  return new Promise(function(resolve, reject) {
    if (!userId) {
      reject('Need user id to create verification.')
    }
    Verification.findOne({userId: userId})
      .then(verification => {
        if (verification) {
          resolve(verification, refreshed);
        } else {
          var newVerification = {
            provider: provider,
            facebook: profile
          }
          if (userId) {
            newVerification.userId = userId;
          }
          Verification.create(newVerification)
            .then(verification => resolve(verification))
        }
      })
  })
}

export function generateNewToken(verification){
  return new Promise(function(resolve, reject){
    console.log('Generating verify token...')
      var token = 'generated'; // FIXME create random string
      var expires = moment().add(1, 'hours').toDate();
      verification.token = token;
      verification.expires = expires;
      verification.save()
        .then(verification => sendVerification(verification))
        .then(verification => resolve(verification))
        .catch(err => reject(err))
    })
}

export function clearVerification(verification){
  return new Promise(function(resolve, reject){
    verification.token = null;
    verification.expires = null;
    verification.save()
      .then(resolve(true))
      .catch(err => reject(err))
  })
}

export function sendVerification(verification) {
  return new Promise(function(resolve, reject) {
    var sent = false;
    var verifyUrl;
    if(!verification.userId){
      console.log('No userId associated with verification, skipping...')
      resolve(sent)
    } else {
      if(process.env.NODE_ENV == 'production'){
        verifyUrl = process.env.DOMAIN + '/api/verify?' + 'userId=' + verification.userId + '&token=' + verification.token;
      } else {
        verifyUrl = 'https://beta.river.ai' + '/api/verify?' + 'userId=' + verification.userId + '&token=' + verification.token;
      }
      var message = {
        userId: verification.userId,
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Hey, I\'m seeing a Facebook login to access your data. Was that you? (Just double checking =) )',
            buttons: [{
              type: 'web_url',
              title: 'Yep, that\'s me!',
              url: verifyUrl
            }, {
              type: 'web_url',
              title: 'That wasn\'t me...',
              url: 'http://google.com'
            }]
          }
        }
      };
      Messages.send(message)
      .then(res => {
        console.log('Sent verification to ' + verification.userId);
        resolve(validation);
      })
      .catch(err => reject(err))
    }
  })
}

export function checkVerification(userId, token){
  return new Promise((resolve, reject) => {
    if(!userId){
      reject('No user id included in request.')
    }
    if(!token){
      resolve(false);
    }
    var verification;
    Verification.findOne({userId: userId, token: token}).exec()
    .then(data => {
      verification = data;
      return User.findById(userId, '-salt -password').exec()
    })
    .then(user => checkVerifyToken(user, verification))
    .then(user => resolve(user))
    .catch(err => reject(err))
  })

  function checkVerifyToken(user, verification){
    return new Promise((resolve, reject) => {
      var now = new Date();
      if(!user){
        console.log('No user found with id: ' + userId);
        reject('No user found with id: ' + userId)
      }
      if(!verification){
        console.log('No matching verification found for user ' + userId + ' with token ' + token)
        reject('No matching verification found for user ' + userId + ' with token ' + token);
      }
      if(token !== verification.token)
      } else {
        console.log('Verification token or expiration doesn\'t match...')
        reject('Verification token or expiration doesn\'t match...')
      }
    });
  }


}

export function checkIfUser(provider, profile){
  if(!profile){
    reject('No profile.')
  }
  if(provider == 'facebook' && profile.id){
    User.find({'facebook.id': profile.id}).exec()
    .then(user => {
      if(!user){
        resolve(null)
      }
      resolve(user);
    })
    .catch(err => reject(err))
  } else {
    reject('Cannot check for user with unknown provider.')
  }
}

export function findVerification(provider, userId, token, user){
  if(user){
    resolve(user)
  }
}

export function validate(verification, profile, userId, token){
  if(!verification){
    resolve(null, {reason: 'noVerification'})
  }
  checkToken(verification, token)
  .then((isValid, reason) => {
    if(!isValid){
      resolve(null, {reason: reason})
    }
    return VerifyService.completeValidation(verification, userId)
  })
}

export function checkToken(verification, token) {
  return new Promise(function(resolve, reject) {
    if (token == verification.token && new Date() < verification.expires) {
      resolve(true);
    } else {
      generateNewToken(validation)
      .then(resolve(false, 'invalidToken'))
      .catch(err => reject(err))
    }
  })
}

export function completeValidation(verification, userId) {
  return new Promise(function(resolve, reject) {
    User.findById(userId).exec()
    .then(user => {
      if (verification.provider == 'facebook') {
        var profile = verification.facebook;
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
      }
    })
  });
}
