'use strict';
var Promise = require('bluebird');
var request = require('request');

import User from '../../api/user/user.model';
import Bid from '../../models/bid/bid.model';

export function getUserByMessengerId(messengerId) {
  return new Promise((resolve, reject) => {
    User.findOne({
        'messenger.id': messengerId
      }).exec()
      .then(user => handleUserCreation(user, messengerId))
      .then(user => updateFbProfile(user))
      .then(user => resolve(user))
      .catch(err => reject(err))
      .catch(err => reject(err))
  })

}

export function handleUserCreation(user, messengerId){
  return new Promise(function(resolve, reject){
    if (user) {
      resolve(user);
    } else {
      var userData = {
        messenger: {
          id: messengerId
        },
      }
      var newUser = new User(userData);
      newUser.provider = 'messenger';
      newUser.role = 'user';
      newUser.state = {
        state: 'waiting',
        turn: 0,
        stored: {}
      }
      newUser.active = true;
      newUser.save()
      .then(user => createIntroBid(user))
      .then(user => resolve(user))
      .catch(err => reject(err))
    }
  })
}

function createIntroBid(user){
  return new Promise(function(resolve, reject){
    console.log('Creating intro bid...')
    Bid.create({
      userId: user._id,
      open: true,
      created: {
        date: new Date(),
        turn: 0
      },
      target:{
        objective: 'preIntroduction',
      },
      force: true,
      modifier: 10
    })
    .then(() => resolve(user))
    .catch(err => reject(err))
  })
}

export function updateFbProfile(user) {
  return new Promise(function(resolve, reject) {
    console.log(user)
    if(!user || !user.messenger || !user.messenger.id){
      reject(new ReferenceError('Need user with messenger id.'))
    }
    var options = {
      url: 'https://graph.facebook.com/v2.6/' + user.messenger.id,
      qs: {
        fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
        access_token: process.env.FB_PAGE_TOKEN
      }
    }
    request.get(options, (err, response, body) => {
      if(err){
        reject(err);
      }
      var fbProfile = JSON.parse(body);
      if(fbProfile.first_name){
        user.firstName = fbProfile.first_name;
      }
      if(fbProfile.last_name){
        user.lastName = fbProfile.last_name;
      }
      if(fbProfile.profile_pic){
        user.picture = fbProfile.profile_pic;
      }
      if(fbProfile.locale){
        user.locale = fbProfile.locale;
      }
      if(fbProfile.gender){
        user.gender = fbProfile.gender;
      }
      if(fbProfile.timezone){
        user.timezone = fbProfile.timezone;
      }
      User.update({'_id': user._id}, user)
      .then(() => resolve(user))
      .catch(err => reject(err))
    })
  })
}
