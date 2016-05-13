'use strict';

var Promise = require('bluebird');
var Metric = require('../../api/metric/metric.service');
import User from '../../api/user/user.model';

// Add item to track. Needs aspect and frequency
export function add(bot, params){
  return new Promise(function(resolve, reject){
    console.log('Adding track...')

    if(!params.aspect || !params.metric){
      reject('Need aspect and metric.')
    }

    User.findById(bot.userId, '-salt -password').exec()
    .then(user => {
      console.log(user.tracked)
      console.log(user._id)
      var frequency = params.frequency || 'daily';
      user.tracked = user.tracked || {};
      user.tracked[params.aspect] = user.tracked[params.aspect] || {};
      user.tracked[params.aspect][params.metric] = {
        active: true,
        frequency: frequency //TODO customize default frequency based on metric
      }
      User.findOneAndUpdate({'_id': user._id},user)
      .then(updated => {
        console.log('Saved!')
        console.log(updated._id)
        console.log(updated.tracked)
        resolve(bot)
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

export function remove(bot){
  return new Promise(function(resolve, reject){
    user.tracked = {}
    user.save()
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function removeAll(bot){

}
