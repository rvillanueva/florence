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
    Entry.find(modelQuery).sort({'meta.created': -1}).exec()
    .then(entries => {
      resolve(entries)
    })
    .catch(err => reject(err))
  })
}
