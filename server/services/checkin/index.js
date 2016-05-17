'use strict';
var Promise = require('bluebird');
var Receive = require('./checkin.receive');
var Load = require('./checkin.load')
import Metric from '../../api/metric/metric.model';

export function run(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Running check-in...')
    askOrSet(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

export function queue(bot, params) {
  return new Promise(function(resolve, reject) {
    console.log('Adding check-in to queue.')
    bot.queueNext({
      type: 'checkin'
    })
      .then(bot => resolve(bot)) // TODO This should really be a diversion but after the current step ends.
      .catch(err => reject(err))
  })
}

export function receive(bot) {
  return new Promise(function(resolve, reject) {
    Receive.run(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}


export function start(bot){
  return new Promise(function(resolve, reject) {
    run(bot)
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}





function askOrSet(bot) {
  if (bot.state.current.checkin && bot.state.current.checkin.query == 'measurement') {
    return ask(bot)
  } else {
    return Load.set(bot)
  }
}

function ask(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Asking...') // TODO build expiration
    if (!bot.state.current.checkin.aspect || !bot.state.current.checkin.metric) {
      reject('Need aspect and metric in checkin measurement.')
    }
    Metric.findOne({
        $and: [{
          'aspect': bot.state.current.checkin.aspect
        }, {
          'metric': bot.state.current.checkin.metric
        }]
      }).exec()
      .then(metric => {
        if (!metric) {
          reject(new TypeError('No metric found with aspect ' + bot.state.current.checkin.aspect + ' and metric ' + bot.state.current.checkin.metric))
        } else {
          console.log('Metric found:')
          console.log(metric)
          bot.state.status = 'waiting';
          return bot.say(metric.question)
        }
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
      .catch(err => reject(err))
  })
}
