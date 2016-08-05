'use strict';
var Promise = require('bluebird');
var request = require('request');

import User from '../../models/user/user.model';
var Message = require('../../services/message');
var TaskService = require('../../services/task');

export function getUserByPhoneNumber(phoneNumber) {
  return new Promise((resolve, reject) => {
    var options = {
      user: {
        provider: 'mobile',
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


export function queueOnboardingTask(user){
  return new Promise(function(resolve, reject){
    user.queue = user.queue || [];
    var taskQuery = {
      objective: 'systemOnboard',
      params: {
        providerName: 'Ryan' // FIXME to put in providers name
      }
    }
    TaskService.query(taskQuery)
    .then(task => {
      if(task){
        user.queue.splice(0,0,{
          taskId: task._id,
          params: taskQuery.params
        })
      }
      resolve(user)
    })
    .catch(err => reject(err))
  })
}
