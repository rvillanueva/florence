'use strict';
var Promise = require('bluebird');
var moment = require('moment');
import User from '../../api/user/user.model';
import * as Messages from '../messages';

export function generateVerifyToken(userId){
  return new Promise(function(resolve, reject){
    console.log('UserId ' + userId)
    User.findById(userId).exec()
    .then(user => {
      if(!user){
        reject('No user found with id: ' + userId)
      }
      var token = 'generated'; // FIX ME
      var expires = moment().add(1, 'hours').toDate();
      user.verify = user.verify || {};
      user.verify.token = token;
      user.verify.expires = expires;
      var returned = {
        token: token,
        expires: expires
      }
      user.save()
        .then(user => resolve(returned))
        .catch(err => reject(err))
    })
  })
}

export function clearVerification(userId){
  return new Promise(function(resolve, reject){
    User.findById(userId).exec()
    .then(user => {
      if(!user){
        reject('No user found with id: ' + userId)
      }
      user.verify = {};
      user.save()
        .then(resolve(true))
        .catch(err => reject(err))
    })
  });
}

export function sendVerification(userId, token) {
  return new Promise(function(resolve, reject) {
    console.log('Sending verification to ' + userId)
    var state = JSON.stringify({
      userId: userId,
      verifyToken: token
    })
    Messages.send({
      userId: userId,
      text: 'test'
    })

    var verifyUrl;
    if(process.env.NODE_ENV == 'production'){
      verifyUrl = process.env.DOMAIN + '/auth/facebook?state=' + state;
    } else {
      verifyUrl = 'https://google.com'
    }

    Messages.send({
      userId: userId,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'Hey, I\'m seeing a Facebook login to access your data. Was that you? (Just double checking.)',
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
    })
    resolve()
  })
}
