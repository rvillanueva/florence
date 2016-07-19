'use strict';
var Promise = require('bluebird');
var request = require('request');

import User from '../../api/user/user.model';
var Queue = require('../../components/dialog/queue');
var Message = require('../../components/message');

export function getUserByPhoneNumber(phoneNumber) {
  return new Promise((resolve, reject) => {
    var options = {
      user: {
        provider: 'mobile',
        mobile: {
          number: phoneNumber
        }
      }
    }
    User.findOne({
        'identity.mobile': phoneNumber
      }).exec()
      .then(user => handleUserCreation(user, options))
      .then(user => resolve(user))
      .catch(err => reject(err))
      .catch(err => reject(err))
  })

}

export function handleUserCreation(user, options){
  return new Promise(function(resolve, reject){
    if (user && user.active) {
      resolve(user);
    } else {
      createInactiveUser(options.user)
      .then(user => replyToInactiveUser(user))
      .then(user => resolve(user))
      .catch(err => reject(err))
    }
  })
}

function replyToInactiveUser(user){
  return new Promise(function(resolve, reject){
    console.log('Sending inactive user reply...')
    var sendable = {
      provider: user.provider,
      userId: user._id,
      messenger: user.messenger,
      mobile: user.mobile,
      text: 'Sorry, it looks like this number has not yet been activated in our system. If you think this is in error, talk with your referring care provider.'
    }
    Message.send(sendable)
    .then(() => resolve(user))
    .catch(err => reject(err))
  })
}

function createNewUser(user){
  return new Promise(function(resolve, reject){
    var newUser = new User(user);
    newUser.role = 'user';
    newUser.state = {
      state: 'waiting',
      active: {
        taskId: null,
        stepId: null
      }
    }
    console.log(newUser)
    newUser.active = true;
    newUser.save()
    .then(user => resolve(user))
    .catch(err => reject(err))

  })
}

function createInactiveUser(user){
  return new Promise(function(resolve, reject){
    console.log('Creating inactive user...')
    console.log(user)
    var newUser = new User(user);
    newUser.role = 'user';
    newUser.state = {
      state: 'waiting',
      active: {
        taskId: null,
        stepId: null
      }
    }
    newUser.active = false;
    console.log(newUser)
    newUser.save()
    .then(user => resolve(user))
    .catch(err => reject(err))
  })
}


function queueOnboardingTask(user){
  return new Promise(function(resolve, reject){
    user.queue = user.queue || [];
    Queue.addTask(user.queue, 'test123')
    .then(queue => {
      user.queue = queue;
      resolve(user)
    })
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
