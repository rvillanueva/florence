'use strict';

var Promise = ('bluebird');
import Response from './response.model';
import Bid from '../bid';

// Get relevant responses
// INPUT: received.features
// OUPUT: cache.responses
export function getMatching(bot){
  return new Promise(function(resolve, reject){
    Response.findOne({'features': bot.received.features})
      .then(responses => {
        bot.cache.responses = responses;
        resolve(bot)
      })
      .catch(err => reject(err))

  })
}

// Filter out tasks that didn't match a response
// INPUT: cache.responses, cache.scores
// OUTPUT: cache.tasks

export function listTaskIds(bot){
 bot.cache.taskIds = [];
 bot.cache.responses.forEach(function(response, r){
   response.bids.forEach(function(bid, b){
     if(bid.targets.intent == bot.received.features.intent){
       bot.cache.taskIds.push(bid.task)
     }
   })
 })
}


// Created bids from matched responses
// INPUT: cache.responses

export function createBids(bot){
  return new Promise(function(resolve, reject){
    var promises = [];

    bot.cache.responses.forEach(function(response, r){
      response.bids.forEach(function(bid, b){
        var created = Bid.create(bid);
        promises.push(created);
      })
    })

    Promise.all(promises)
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}
