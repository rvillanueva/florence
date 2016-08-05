'use strict';
var Promise = require('bluebird');
var request = require('request');

import User from '../../models/user/user.model';
var Queue = require('../queue');
var Message = require('../message');

export function getUserByPhoneNumber(phoneNumber) {
  return new Promise((resolve, reject) => {
    var options = {
      user: {
        provider: {
          auth: 'mobile',
          messaging: 'mobile'
        },
        identity: {
          mobile: phoneNumber
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
      .then(user => resolve(user))
      .catch(err => reject(err))
    }
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
    newUser.save()
    .then(user => resolve(user))
    .catch(err => reject(err))
  })
}


function queueOnboardingTask(user){
  return new Promise(function(resolve, reject){
    user.queue = user.queue || [];
    Queue.addTodo(user.queue, 'test123')
    .then(queue => {
      user.queue = queue;
      resolve(user)
    })
    .catch(err => reject(err))
  })
}
