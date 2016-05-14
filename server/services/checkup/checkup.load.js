'use strict';
var Promise = require('bluebird');
var Entry = require('../entry');
import Metric from '../../api/metric/metric.model';

export function set(bot) {
  return new Promise(function(resolve, reject) {
    var tracked;
    var entries;
    console.log('Loading next checkin question...')
    getTracked(bot)
      .then(bot => getEntries(bot))
      .then(bot => chooseNextMeasurement(bot))
      .then(bot => handleNext(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
      // Get user tracked data
      // Get latest entries
      // Check to see what needs to be entered
      // Load next metric needed

  })
}

function getTracked(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Getting user...')
    bot.getUser()
      .then(user => {
        bot.cache.tracked = user.tracked;
        resolve(bot);
      })
      .catch(err => reject(err))
  })
}

function getEntries(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Getting entries...')
    Entry.getDay(bot)
      .then(entries => {
        console.log('Entries received.')
        // merge entry data
        var entryData = {};
        entries.forEach(function(entry, e) {
          entry.data = entry.data || {};
          for (var aspect in entry.data) {
            if (entry.data.hasOwnProperty(aspect)) {
              for (var metric in entry.data[aspect]) {
                if (entry.data[aspect].hasOwnProperty(metric)) {
                  entryData[aspect] = entryData[aspect] || {}
                  entryData[aspect][metric] = entryData[aspect][metric] || {}
                  if (!entryData[aspect][metric].value) {
                    entryData[aspect][metric] = entry.data[aspect][metric];
                  }
                }
              }
            }
          }
        })
        bot.cache.entries = entries;
        bot.cache.entryData = entryData;
        console.log('Entry data merged.')
        resolve(bot);
      })
      .catch(err => reject(err))
  })
}

function chooseNextMeasurement(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Choosing next measurement...')
    bot.cache.tracked = bot.cache.tracked || {};
    console.log('Entry data:')
    console.log(bot.cache.entryData);
    var currentAspect;
    var tracked = bot.cache.tracked;
    var followsAspect = [];
    var switchAspect = [];
    var selected;
    if(bot.state.current.checkup && bot.state.current.checkup.aspect){
      currentAspect = bot.state.current.checkup.aspect
    }
    console.log('Looping through tracked metrics...')
    for (var aspect in tracked) {
      if (tracked.hasOwnProperty(aspect)) {
        for (var metric in tracked[aspect]) {
          if (tracked[aspect].hasOwnProperty(metric)) {
            var coords = {
              aspect: aspect,
              metric: metric
            }
            if(
              !bot.cache.entryData ||
              !bot.cache.entryData[aspect] ||
              !bot.cache.entryData[aspect][metric] ||
              !bot.cache.entryData[aspect][metric].value
            ){
              console.log('Found missing metric ' + metric);
              if(currentAspect && aspect == currentAspect){
                followsAspect.push(coords);
              } else {
                switchAspect.push(coords);
              }
            }
          }
        }
      }
    }
    console.log('Search complete.')
    selected = followsAspect[0] || switchAspect[0] || null;
    if(selected){
      bot.loaded.next = {
        type: 'checkup',
        checkup: {
          query: 'measurement',
          metric: selected.metric,
          aspect: selected.aspect
        }
      }
    } else {
      bot.loaded.next = null;
    }
    resolve(bot);
  })
}

function handleNext(bot) { // TODO Should reroute all load setting into single service
  return new Promise(function(resolve, reject) {
    console.log('Handling next...')
    if(!bot.loaded.next){
      bot.say('Great! That\'s all I have for now.');
      bot.state.current = null;
      bot.state.status = 'next';
      resolve(bot);
    } else {
      bot.state.status = 'checkup';
      bot.set(bot.loaded.next)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    }
  })
}
