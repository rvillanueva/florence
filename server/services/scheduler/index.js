'use strict';

var Promise = require('bluebird');
var CheckIn = require('../checkup');
import User from '../../api/user/user.model';

export function init() {
  //set up cron job
  // last check-in
}

export function runCheckIns() {
  return new Promise(function(resolve, reject) {
    User.find({}).exec()
      .then(users => filterUsers(users))
      .then(users => checkInWithUsers(users))
      .then(() => resolve(true))
      .catch(err => reject(err))
  })
}

function filterUsers(users) {
  return new Promise(function(resolve, reject) {
    var returned = [];
    users.forEach(function(user, u) {
        if (needsCheckIn(user)) {
          returned.push(user);
        }
      })
      .then(users => resolve(users))
      .catch(err => reject(err))
  })
}

function needsCheckIn(user) {
  var today = new Date();
  user.engagement = user.engagement || {};
  if (!user.engagement.maxFrequency) {
    return false;
  } else if (!user.engagement.lastCheckIn ||
    ((7 / user.engagement.maxFrequency) >= (today - user.engagement.lastCheckIn))
  ) {
    return true;
  } else {
    return false;
  }
}



function checkInWithUsers(users) {
  return new Promise(function(resolve, reject) {
    var promises = []
    users.forEach(function(user, u) {
      promises.push(startCheckIn(user))
    })
    Promise.all(promises)
      .then(() => resolve(true))
      .catch(err => reject(err))
  })
}

function startCheckIn(user) {
  return new Promise(function(resolve, reject) {
    //if()
    CheckIn.start(user._id)
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
