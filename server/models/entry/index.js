'use strict';

var Promise = require('bluebird');

import Entry from './entry.model';

export function create(data){
  var entry = data;
  entry.meta = {
    created: new Date()
  }
  return Entry.create(response);
}

export function search(query){
  return null;
}

export function getByUserId(userId){
  return new Promise(function(resolve, reject){
    Entry.find({'userId':userId})
    .then(entries => resolve(entries))
    .catch(err => reject(err))
  })
}
