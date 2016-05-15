'use strict';
var Promise = require('bluebird');
var Receive = require('./checkup.receive');
var Load = require('./checkup.load')
import Metric from '../../api/metric/metric.model';

export function run(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Running checkup...')
    askOrSet(bot)
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

export function receive(bot) {
  return new Promise(function(resolve, reject) {
    Receive.run(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

function askOrSet(bot) {
  if (bot.state.current.checkup && bot.state.current.checkup.query == 'measurement') {
    return ask(bot)
  } else {
    return Load.set(bot)
  }
}

function ask(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Asking...')
    if (!bot.state.current.checkup.aspect || !bot.state.current.checkup.metric) {
      reject('Need aspect and metric in checkup measurement.')
    }
    Metric.findOne({
        $and: [{
          'aspect': bot.state.current.checkup.aspect
        }, {
          'metric': bot.state.current.checkup.metric
        }]
      }).exec()
      .then(metric => {
        if (!metric) {
          reject(new TypeError('No metric found with aspect ' + bot.state.current.checkup.aspect + ' and metric ' + bot.state.current.checkup.metric))
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
