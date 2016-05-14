'use strict';
var Promise = require('bluebird');
var Receive = require('./checkup.receive');
var Load = require('./checkup.load')
import Metric from '../../api/metric/metric.model';

export function run(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Running checkup...')
    ask(bot)
    .then(bot => Load.set(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function queue(bot, params) {
  return new Promise(function(resolve, reject) {
    console.log('Adding checkin to queue.')
    bot.queueNext({
      type: 'checkup'
    })
    .then(bot => resolve(bot)) // TODO This should really be a diversion but after the current step ends.
    .catch(err => reject(err))
  })
}

export function receive(bot){
  return new Promise(function(resolve, reject) {
    Receive.run(bot)
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function ask(bot){
  return new Promise(function(resolve, reject) {
    console.log('Asking...')
    console.log(bot.state.current)
    if(bot.state.current.type !== 'checkup'){
      reject(new TypeError('Current status is not checkup.'))
    }
    if(bot.state.current.checkup && bot.state.current.checkup.query == 'measurement'){
      console.log('Asking about measurement...')
      if(!bot.state.current.checkup.aspect || !bot.state.current.checkup.metric){
        reject('Need aspect and metric in checkup measurement.')
      }
      console.log('Finding metric...')
      Metric.findOne({
          $and:[{
            'aspect': bot.state.current.checkup.aspect
          },{
            'metric': bot.state.current.checkup.metric
          }]
        }).exec()
        .then(metric => {
          if(!metric){
            console.log('No metric found.')
            reject(new TypeError('No metric found with aspect ' + bot.state.current.checkup.aspect + ' and metric ' + bot.state.current.checkup.metric))
          } else {
            console.log('Metric found:')
            console.log(metric)

            return bot.say(metric.question)
          }
        })
        .then(bot => resolve(bot))
        .catch(err => reject(err))
        .catch(err => reject(err))
    } else {
      console.log('Nothing to ask, proceeding...')
      // TODO Ask for permission to start.
      resolve(bot);
    }
  })
}
