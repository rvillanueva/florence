'use strict';

var Promise = require('bluebird');
var DialogService = require('../dialog');
var moment = require('moment');

export function notifyReadyUsers(users){
  return new Promise(function(resolve, reject){
    filterUsersWithEmptyQueue(users)
    .then(users => notifyUsers(users))
    .then(() => resolve(true))
    .catch(err => reject(err))
  })

  function filterUsersWithEmptyQueue(users){
    return new Promise(function(resolve, reject){
      console.log('Filtering users...');
        var filteredUsers = [];
        users = users || [];

        users.forEach(function(user, u){
          if(user.queue.length > 0){
            filteredUsers.push(user)
          }
        })
        resolve(filteredUsers);
    })
  }


  function notifyUsers(users){
    return new Promise(function(resolve, reject){
      console.log('Notifying users:');
      console.log(users)
      var promises = [];
      users = users || [];
      users.forEach(function(user, u){
        promises.push(notifyOne(user))
      })
      Promise.all(promises)
      .then(() => resolve(true))
      .catch(err => reject(err))
    })
  }


  function notifyOne(user){
    return new Promise(function(resolve, reject){
      var botOptions;
      updateNotificationFields();
      botOptions = {
        user: user,
        received: false
      }
      DialogService.notify(botOptions)
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
