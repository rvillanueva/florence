'use strict';

var Promise = require('bluebird');
var CheckIn = require('../services/checkin');
var Bot = require('../bot');
import User from '../api/user/user.model';
import config from '../config/environment';
var Agenda = require('agenda');
var agenda = new Agenda({db: {address: config.mongo.uri}});

agenda.define('runCheckInsJob', function(job, done) {
    console.log('Running scheduled check in job...')
    runCheckIns()
    .then(() => done())
    .catch(err => done(err))
});


export function init() {
  agenda.on('ready', function() {
    console.log('Scheduler ready.')
    agenda.every('30 minutes', 'runCheckInsJob');
    agenda.start();
  });
}


export function runCheckIns() {
  return new Promise(function(resolve, reject) {
    console.log('Running check in....')
    User.find({}).exec()
      .then(users => filterUsers(users))
      .then(users => checkInWithUsers(users))
      .then(() => resolve(true))
      .catch(err => reject(err))
  })
}

function filterUsers(users) {
  return new Promise(function(resolve, reject) {
    users = users || [];
    var returned = [];
    users.forEach(function(user, u) {
      if (needsCheckIn(user)) {
        returned.push(user);
      }
    })
    resolve(returned)
  })
}

function needsCheckIn(user) {

  user.engagement = user.engagement || {};
  if (!user.engagement.maxFrequency) {
    return false;
  }
  if(user.engagement.maxFrequency && user.engagement.maxFrequency > 0 && !user.engagement.lastCheckInRequest) {
    return true;
  }
  var offset = user.timezone || -4;
  var timeCreepOffset = 2;
  var now = moment();
  var timeLastRequest = moment(user.engagement.lastCheckInRequest)
  var hoursDiff = timeLastRequest.diff(now, 'hours');
  var hourlyPeriod = 7*24 / user.engagement.maxFrequency;
  var hourOfDay = moment().hour() + offset;

  if (hoursDiff > hourlyPeriod - timeCreepOffset && hourOfDay > 16 && hourOfDay < 19) {
    return true;
  } else {
    return false;
  }
}



function checkInWithUsers(users) {
  return new Promise(function(resolve, reject) {
    var promises = []
    if(users){
      users.forEach(function(user, u) {
        promises.push(startCheckIn(user))
      })
      Promise.all(promises)
        .then(() => resolve(true))
        .catch(err => reject(err))
    } else {
      resolve(true);
    }
  })
}

function startCheckIn(user) {
  return new Promise(function(resolve, reject) {
    console.log('Starting check in for user ' + user._id)
    Bot.create(user._id)
      .then(bot => CheckIn.start(bot))
      .then(() => resolve(true))
      .catch(err => reject(err))
  })
}

// For all users
// every hour8
// check last checkin time
// if hoursSinceLastCheckInRequest > 7/checkInsPerWeek * 24
// and if it falls within a reasonable hour (4-7pm their timezone || est (-4))
// startCheckIn for user
