'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    // Check what
    resolve(bot)
  })
}

export function start(bot, params) {
  return new Promise(function(resolve, reject) {
    bot.queueNext({
        type: 'checkup'
      }) // TODO This should really be a diversion but after the current step ends.
    resolve(bot)
  })
}

export function receive(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.current.type !== 'checkup') {
      reject(new TypeError('Current step ' + bot.state.current.type + 'is not checkup.'))
    }
    if (!bot.state.current.checkup) {
      reject(new TypeError('No checkup data.'))
    }

    var checkup = bot.state.current.current.checkup || {};
    if (checkup.query == 'measurement') {
      if (!checkup.metric) {
        reject(new TypeError('For measurement query, need metric.'))
      } else {


        Metric.findOne({
            'key': checkup.metric
          }).exec()
          .then(metric => {
            if (!metric) {
              reject(new TypeError('No metric found for key ' + checkup.metric))
            } else {
              bot.cache.metric = metric;
              return createCachedEntry(bot, metric)
            }
          })
          .then(bot => handleMatched(bot))
          .then(bot => analyzeText(bot))
          .then(bot => handleUnmatched(bot))
          .then(bot => resolve(bot))
          .catch(err => reject(err))
      }
    } else {
      reject(new TypeError('Unknown checkup query ' + checkup.query))
    }
    // get metric from current
    // validate response
    // accept it or redirect remind and wait(wait)
    // if finished, end checkup
    // else continue to converse
    resolve(bot)
  })

}

function createCachedEntry(bot, metric) {
  return new Promise(function(resolve, reject) {
    bot.cache.entry = bot.cache.entry || {};
    bot.cache.entry.data = bot.cache.entry.data || {};
    bot.cache.entry.data[metric.aspect] = bot.cache.entry[metric.aspect] || {};
    bot.cache.entry.data[metric.aspect][metric.metric] = bot.cache.entry[metric.aspect][metric.metric] || {};
    bot.cache.entry.data[metric.aspect][metric.metric].unmatched = bot.cache.entry.data[metric.aspect][metric.metric].unmatched || [];
    resolve(bot)
  })
}

// TODO add text analysis
function analyzeText(bot) {
  return new Promise(function(resolve, reject) {
    resolve(bot)
  })
}

function handleMatched(bot, metric) {
  return new Promise(function(resolve, reject) {
    var metric = bot.cache.metric;
    Interpreter.matchMetricInput(bot)
    .then(value => storeValue(bot, metric, value))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function handleUnmatched(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.cache.entry.data[metric.aspect][metric.metric].value) {
      resolve(bot)
    } else {
      bot.cache.entry.data[metric.aspect][metric.metric].unmatched.push({
        date: new Date(),
        text: bot.message.text
      })
      var string = '';
      var metric = bot.cache.metric;
      if (metric.data.type == 'numerical') {
        string = 'Try giving me a number.'
      } else if (metric.data.type == 'categorical') {
        string = 'Try typing something that matches one of the categories.'
      }
      bot.say('That wasn\'t I was expecting, but I\'ve stored it for future reference.')
      bot.say(string);
      resolve(bot);
    }
  })
}

function storeValue(bot, metric, value) {
  return new Promise(function(resolve, reject) {
    if(value == false){
      resolve(bot);
    } else {
      bot.cache.entry.data[metric.aspect][metric.metric].value = value;
      resolve(bot);
    }
  })
}


function reprompt(bot, metric) {

}
