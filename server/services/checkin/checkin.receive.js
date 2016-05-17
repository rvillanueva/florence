'use strict';
var Promise = require('bluebird');
var Interpreter = require('../interpreter');
import Metric from '../../api/metric/metric.model';

export function run(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Receiving using checkin service...')
    if (bot.state.current.type !== 'checkin') {
      reject(new TypeError('Current step ' + bot.state.current.type + 'is not checkin.'))
    }
    if (!bot.state.current.checkin) {
      reject(new TypeError('No checkin data.'))
    }

    var checkin = bot.state.current.checkin || {};
    console.log('Parameters:')
    console.log(checkin);
    if (checkin.query == 'measurement') {
      if (!checkin.metric || !checkin.aspect) {
        reject(new TypeError('For measurement query, need metric and aspect.'))
      } else {
        console.log('Returning relevant metric...')
        Metric.findOne({
          $and:[{
            'aspect': bot.state.current.checkin.aspect
          },{
            'metric': bot.state.current.checkin.metric
          }]
        }).exec()
          .then(metric => {
            return new Promise(function(resolve, reject) {
              console.log('Returned data.')
              if (!metric) {
                reject(new TypeError('No metric found for key ' + checkin.metric))
              } else {
                console.log('Metric found:')
                console.log(metric)
                bot.cache.metric = metric;
                resolve(bot);
              }
            })
          })
          .then(bot => createCachedEntry(bot))
          .then(bot => handleMatched(bot))
          .then(bot => analyzeText(bot))
          .then(bot => handleUnmatched(bot))
          .then(bot => saveEntry(bot))
          .then(bot => setNext(bot))
          .then(bot => resolve(bot))
          .catch(err => reject(err))
      }
    } else {
      reject(new TypeError('Unknown checkin query ' + checkin.query))
    }
    // get metric from current
    // validate response
    // accept it or redirect remind and wait(wait)
    // if finished, end checkin
    // else continue to converse
  })

}

function createCachedEntry(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Creating cached entry...')
    var metric = bot.cache.metric;
    bot.cache.entry = bot.cache.entry || {};
    bot.cache.entry.data = bot.cache.entry.data || {};
    bot.cache.entry.data[metric.aspect] = bot.cache.entry.data[metric.aspect] || {};
    bot.cache.entry.data[metric.aspect][metric.metric] = bot.cache.entry.data[metric.aspect][metric.metric] || {};
    bot.cache.entry.data[metric.aspect][metric.metric].unmatched = bot.cache.entry.data[metric.aspect][metric.metric].unmatched || [];
    console.log('Cached entry created:')
    console.log(bot.cache.entry)
    resolve(bot)
  })
}

// TODO add text analysis
function analyzeText(bot) {
  console.log('Analyzing text..')
  return new Promise(function(resolve, reject) {
    resolve(bot)
  })
}

function handleMatched(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Validating input for measurement...')
    var metric = bot.cache.metric;
    Interpreter.getMeasurementValue(bot)
    .then(value => storeValue(bot, value))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function handleUnmatched(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Handling data that didn\'t pass validation...')
    var metric = bot.cache.metric;
    if (bot.cache.entry.data[metric.aspect][metric.metric].value) {
      bot.say('Great, thanks so much.') // TODO Create bot.thanks function.
     resolve(bot)
    } else {
      console.log('Handling unmatched data.')
      console.log(bot.cache.entry.data[metric.aspect][metric.metric]);
      bot.cache.entry.data[metric.aspect][metric.metric].unmatched.push({
        date: new Date(),
        text: bot.message.text
      })
      var string = '';
      var metric = bot.cache.metric;
      if (metric.validation.type == 'number') {
        string = ' It looks like we also need a number for this question, though.'
      } else if (metric.validation.type == 'category') {
        string = ' But it looks like we also need something that matches one of the categories.'
      }
      bot.say('Thanks - I\'ve stored that for future reference.' + string)
      bot.say(metric.question)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    }
  })
}

function storeValue(bot, value) {
  return new Promise(function(resolve, reject) {
    console.log('Storing value...')
    var metric = bot.cache.metric;
    if(!value){
      console.log('No value stored...')
      resolve(bot);
    } else {
      bot.cache.entry.data[metric.aspect][metric.metric].value = value;
      console.log('Value stored: ' + value)
      resolve(bot);
    }
  })
}

function saveEntry(bot){
  return new Promise(function(resolve, reject) {
    bot.entry(bot.cache.entry)
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

function setNext(bot){
  return new Promise(function(resolve, reject) {
    bot.loaded.next = {
      type: 'checkin'
    }
    resolve(bot);
  })

}
