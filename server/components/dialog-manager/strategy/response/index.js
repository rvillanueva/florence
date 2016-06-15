'use strict';

var ResponseService = require('./response.service');



// Create bids from matching responses
// INPUT: received.features

export function getRelevantTaskIds(bot){
  return new Promise(function(resolve, reject){
    ResponseService.getMatching(bot)
    .then(bot => ResponseService.listTaskIds(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function createBids(bot){
  return ResponseService.createBids(bot);
}
