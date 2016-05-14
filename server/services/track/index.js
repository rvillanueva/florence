'use strict';

var Promise = require('bluebird');
var Metric = require('../../api/metric/metric.service');
import User from '../../api/user/user.model';

// Add item to track. Needs aspect and frequency
export function add(bot, params){
  return new Promise(function(resolve, reject){

    if(!params.aspect || !params.metric){
      reject('Need aspect and metric.')
    }

    console.log('Adding track ' + params.aspect + '.' + params.metric + '...')


    bot.getUser()
    .then(user => {
      var frequency = params.frequency || 'daily';
      user.tracked = user.tracked || {};
      user.tracked[params.aspect] = user.tracked[params.aspect] || {};
      user.tracked[params.aspect][params.metric] = {
        active: true,
        frequency: frequency //TODO customize default frequency based on metric
      }
      User.findOneAndUpdate({'_id': user._id},user)
      .then(updated => {
        resolve(bot)
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

export function remove(bot, params){
  return new Promise(function(resolve, reject){
    if(!params.aspect || !params.metric){
      reject('Need aspect and metric to remove.')
    }
    bot.getUser()
    .then(user => {
      user.tracked = user.tracked || {};
      user.tracked[params.aspect] = user.tracked[params.aspect] || {};
      user.tracked[params.aspect][params.metric] = user.tracked[params.aspect][params.metric] || {};
      user.tracked[params.aspect][params.metric].active = false;
      User.findOneAndUpdate({'_id': user._id},user)
      .then(updated => {
        resolve(bot)
      })
      .catch(err => reject(err))
    })
  })
}

export function removeAll(bot){
  return new Promise(function(resolve, reject){
    if(!params.aspect || !params.metric){
      reject('Need aspect and metric to remove.')
    }
    bot.getUser()
    .then(user => {
      user.tracked = {}
      User.findOneAndUpdate({'_id': user._id},user)
      .then(updated => {
        resolve(bot)
      })
      .catch(err => reject(err))
    })
  })
}