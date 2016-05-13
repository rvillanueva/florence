'use strict';
import Entry from '../../api/entry/entry.model';
var moment = require('moment');

export function addNew(entry) {
  return new Promise((resolve, reject) => {
    var newEntry = new Entry(entry);
    newEntry.date = new Date();
    newEntry.save()
      .then(res => resolve(entry))
      .catch(err => resolve(err))
  })
}

function resolveEntries(lastEntry, newEntry) {
  return new Promise((resolve, reject) => {
    delete newEntry._id;
    // Cycle through each aspect
    for (var aspect in newEntry) {
      if (newEntry.hasOwnProperty(aspect)) {
        // Cycle through each metric
        for (var metric in newEntry[aspect]) {
          if (newEntry[aspect].hasOwnProperty(metric)) {
            lastEntry.data[aspect] = lastEntry.data[aspect] || {};
            lastEntry.data[aspect][metric] = newEntry.data[aspect][metric];
          }
        }
      }
    }
    resolve(lastEntry);
    // Need to handle tags too
  })
}

function updateTracking(entry) {
  return new Promise((resolve, reject) => {
    // Cycle through each aspect
    User.findById(entry.userId).exec()
    .then(user => {
      for (var aspect in entry) {
        if (entry.hasOwnProperty(aspect)) {
          // Cycle through each metric
          for (var metric in entry[aspect]) {
            if (entry[aspect].hasOwnProperty(metric)) {
              user.tracked = user.tracked || {};
              user.tracked[aspect] = user.tracked[aspect] || {};
              user.tracked[aspect][metric] = user.tracked[aspect][metric] || {};
              user.tracked[aspect][metric].updated = new Date();
            }
          }
        }
      }
    })
  })
}

export function add(entry) {
  return new Promise((resolve, reject) => {
    var expiration = moment().subtract(1, 'hours').toDate();
    if (!entry.userId) {
      reject('UserId required for entry.')
    }
    console.log('Creating entry:');
    console.log(entry);
    Entry.find({
        date: {
          "$gt": expiration
        },
        userId: entry.userId
      }).sort('added').exec()
      .then(entries => {
        if (!entries || entries.length == 0) {
          addNew(entry)
            .then(res => resolve(res))
            .catch(err => reject(err))
        } else {
          resolveEntries(entries[0], entry)
            .then(res => resolve(res))
            .catch(err => reject(err))
        }
      })
  })
}
