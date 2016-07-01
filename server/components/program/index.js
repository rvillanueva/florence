'use strict';

import Entry from './entry.model';

export create function(newEntry, source){
  return new Promise(function(resolve, reject){
    delete newEntry._id;
    newEntry.source = [{
      type: source.type,
      sourceId: source.sourceId,
      date: new Date()
    }];
    newEntry.created = new Date();
    return Entry.create(newEntry);
  })
}
