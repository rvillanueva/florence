'use strict';
import Entry from '../../api/entry/entry.model';

export function addNew(entry){
  return new Promise((resolve, reject) => {
    var newEntry = new Entry(entry);
    newEntry.created = new Date();
    newEntry.save()
    .then(res => resolve(entry))
    .catch(err => resolve(err))
  })
}

function resolveEntries(lastEntry, newEntry){
  return new Promise((resolve, reject) => {
    if(lastEntry.value && newEntry.value || lastEntry.triggers && newEntry.triggers){
      createEntry(newEntry)
    } else {
      if(!lastEntry.value && newEntry.value){
        lastEntry.value = newEntry.value
      }
      if(!lastEntry.triggers && newEntry.triggers){
        lastEntry.triggers = newEntry.triggers
      }
    }

    // Need to handle tags too
  })
}

export function add(entry, userId){
  return new Promise((resolve, reject) => {
    var expiration = moment().subtract(1, 'hours').toDate();
    entry.userId = userId;
    if(!entry.measure){
      reject('Need measure with entry.')
    }
    console.log('Creating entry:');
    console.log(entry);
    Entry.find({added:{"$gt": expiration}, measure: entry.measure, userId: userId}).sort('added').exec()
    .then(entries => {
      if (!entries || entries.length == 0) {
        addNew(entry)
        .then(res => resolve(res))
        .catch(err => reject(err))
      } else {
        resolveEntries(entries[0], entry)
        .then(res = resolve(res));
        .catch(err => reject(err))
      }
    })
  })
}
