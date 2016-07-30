'use strict';

var Promise = require('bluebird');
var DialogService = require('../dialog');
var InstructionsService = require('../instructions');
var Bot = require('../bot')
import User from '../../models/user/user.model';

export function notifyReadyUsers(user){
  return new Promise(function(resolve, reject){
    var promises = [];
    User.find({'notifications.nextContact':{ '$lt': new Date() }})
    .then(users => addTasksForEach(users))
    .then(users => filterUsersWithEmptyQueue(users))
    .then(users => notifyUsers(users))
    .then(() => resolve(true))
    .catch(err => reject(err))
  })

  function addTasksForEach(users){
    var promises = [];
    var updatedUsers = [];

    return new Promise(function(resolve, reject){
      users = users || [];
      users.forEach(function(user, u){
        promises.push(queueTasks(user));
      })

      Promise.all(promises)
      .then(() => resolve(updatedUsers))
      .catch(err => reject(err))
    })

    function queueTasks(user){
      return new Promise(function(resolve, reject){
        Instructions.queueTasks(user)
        .then(user => {
          updatedUsers.push(user)
          resolve()
        })
        .catch(err => reject(err))
      })
    }
  }

  function filterUsersWithEmptyQueue(users){
    return new Promise(function(resolve, reject){
      var filteredUsers = [];
      users = users || [];

      users.forEach(function(user, u){
        if(users.queue.length > 0){
          filteredUsers.push(user)
        }
      })
      return filteredUsers;
    })
  }

  function notifyUsers(users){
    var promises = [];
    users = users || [];
    users.forEach(function(user, u){
      promises.push(notifyOne(user))
    })
    Promise.all(promises)
    .then(() => resolve(true))
    .catch(err => reject(err))
  }


  function notifyOne(user){
    return new Promise(function(resolve, reject){
      var botOptions;
      updateNotificationFields();
      botOptions = {
        user: user,
        received: false
      }
      Dialog.notify(botOptions)
      .then(() => resolve(true))
      .catch(err => reject(err))
    })

    function updateNotificationFields(){
      user.notifications = user.notifications || {};
      user.notifications.lastContact = new Date();
      user.notifications.nextContact = moment().add(1, 'day');
      user.notifications.attempts = user.notifications.attempts || 0;
      user.notifications.attempts ++;
    }
  }
  /*
  process
  every hour, system pulls all user where "nextContact" date < now.

  check instructions.
  for each instruction, look at the last time data was received and compare distance from now
  if distance from now is greater than the frequency of measurement (12 hours for daily, 6 days for weekly in of a late trigger),
  ensure item is queued


  check to make sure you're firing within the preferred hour window (up to +2 hours). If so, fire a notification to the user
  then increment contactAttempts date to later date. (the contactAttempts # indicates the amount you increase the nextcontact date: +1 day, +2 day, +4 day, +7 day, +14 day at preferred hour).
  */


}
