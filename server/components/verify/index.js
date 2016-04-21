'use strict';
var Promise = require('bluebird');
var moment = require('moment');
import User from '../../api/user/user.model';
import * as Messages from '../messages';
import Verification from '../../api/verification/verification.model';

export function createVerification(provider, profile, userId){
  return new Promise(function(resolve, reject){
    if(provider === 'facebook' && profile){
      var verification = {
        provider: provider,
        facebook: profile
      }
      if(userId){
        verification.userId = userId;
      }
      Verification.create(verification)
      .then(verification => generateVerifyToken(verification))
      .then(verification => sendVerification(verification))
      .then(sent => resolve(sent))
      .catch(err => reject(err))
    } else {
      console.log('No provider or profile.')
      reject('No provider or profile.')
    }
  })
}

export function generateVerifyToken(verification){
  return new Promise(function(resolve, reject){
    console.log('Generating verify token...')
      var token = 'generated'; // FIXME create random string
      var expires = moment().add(1, 'hours').toDate();
      verification.token = token;
      verification.expires = expires;
      verification.save()
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
    console.log('Sending verification...');
    var sent = false;
    var verifyUrl;
    if(!verification.userId){
      console.log('No userId associated with verification, skipping...')
      resolve(sent)
    } else {
      if(process.env.NODE_ENV == 'production'){
        verifyUrl = process.env.DOMAIN + '/auth/facebook?' + 'userId=' + verification.userId + '&token=' + verification.token;
      } else {
        verifyUrl = 'https://beta.river.ai' + '/auth/facebook?' + 'userId=' + verification.userId + '&token=' + verification.token;
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
        console.log('Sent verification to ' + verification.userId)
        sent = true;
        resolve(sent);
      })
      .catch(err => reject(err))
    }
  })
}

export function checkVerification(userId, token){
  return new Promise(function(resolve, reject){
    Verification.findOne({userId: userId, token: token}).exec()
    .then(verification => User.findById(userId, '-salt -password').exec())
    .then(user => checkVerifyToken(user, verification))
    .then(user => resolve(user))
    .catch(err => reject(err))
  })

  function checkVerifyToken(user, verification){
    return new Promise(function(resolve, reject){
      if(!user){
        reject('No user found with id: ' + userId)
      }
      if(!verification){
        reject('No matching verification found for user ' + userId + ' with token ' + token);
      }
      if(token == verification.token && new Date() < verification.expires){
        if(verification.provider == 'facebook'){
          verifyFacebook(user, verification)
          .then(user => resolve(user))
          .catch(err => reject(err))
        } else {
          reject('Unknown provider: ' + verification.provider)
        }
      }
      reject('No verification item found.')
    });
  }

  function verifyFacebook(user, verification){
    return new Promise(function(resolve, reject){
      var profile = verification.facebook;
      if(profile.picture){
        user.picture = profile.picture;
      }
      if(!user.email){
        user.email = profile.emails[0].value;
      }
      user.facebook = profile;
      verification.remove()
      .then(res => resolve(user))
      .catch(err => reject(err))
    });
  }

}
