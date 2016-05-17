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
    var sorted = {
      sameAspect: [],
      changedAspect: []
    }
    var currentAspect;
    var tracked = bot.cache.tracked;
    console.log('Tracked:')
    console.log(tracked);
    var selected = false;
    if(bot.state.current.checkin && bot.state.current.checkin.aspect){
      currentAspect = bot.state.current.checkin.aspect
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
              if(currentAspect && aspect == currentAspect){
                sorted.sameAspect.push(coords)
              } else {
                sorted.changedAspect.push(coords)
              }
            }
          }
        }
      }
    }
    var searched = []
    if(sorted.sameAspect.length > 0){
      searched = sorted.sameAspect;
    } else if (sorted.changedAspect.length > 0){
      searched = sorted.changedAspect;
    }
    searched.forEach(function(coords, c){
      if(!selected || tracked[coords.aspect][coords.metric].priority < tracked[selected.aspect][selected.metric].priority){
        selected = coords;
      }
    })
    if(selected){
      bot.loaded.next = {
        type: 'checkin',
        checkin: {
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
      bot.say('That\'s all I have for now.');
      bot.state.current = null;
      bot.state.status = 'next';
      resolve(bot);
    } else {
      bot.state.status = 'checkin';
      bot.set(bot.loaded.next)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    }
  })
}
