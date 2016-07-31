'use strict';

var Promise = require('bluebird');

import Entry from './entry.model';

export function create(entry){
  entry.meta = entry.meta || {};
  entry.meta.created =  new Date();
  console.log('NEW ENTRY:')
  console.log(entry)
  return Entry.create(entry);
}

export function get(query){
  return new Promise(function(resolve, reject){
    var modelQuery = {};
    if(query.userId){
      modelQuery.userId = query.userId
    }
    if(query.params){
      for (var param in query.params){
        if (query.params.hasOwnProperty(param)) {
          var property = 'meta.params.' + param;
          modelQuery[property] = query.params[param];
        }
      }
    }
    modelQuery = {};
    console.log('Querying entries:')
    console.log(modelQuery)
    Entry.find(modelQuery).exec()
    .then(entries => {
      console.log(entries)
      resolve(entries)
    })
    .catch(err => reject(err))
  })
}
