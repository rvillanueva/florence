'use strict';

var Promise = ('bluebird');
var TaskService = require('../task');

// Get expected responses from active task
// INPUT: bot.cache.task
// OUPUT: bot.cache.tasks
export function handleExpected(bot){
  return new Promise(function(resolve, reject){

    if(!bot.cache.task.next || bot.cache.task.next.length == 0){
      bot.cache.tasks = [];
      resolve(bot)
    }

    TaskService.getByNext(bot.cache.next)
    .then(bot => resolve(bot))
    .catch(err => reject(err))

    }
  })

  function filterByParams(bot){
    // Match context to params
  }
}

// If no expected response matches, search related tasks and then global tasks
// INPUT: bot.cache.tasks
// OUPUT: bot.cache.task
export function handleInterjection(bot){
  return new Promise(function(resolve, reject){
    if(bot.cache.tasks && bot.cache.tasks.length > 0){
      resolve(bot)
    } else {
      resolve(bot)
    }

  })
}

// If still no tasks have been found, use task's confusion handle or default
// INPUT: bot.cache.tasks
// OUPUT: bot.cache.task
export function handleNonUnderstanding(bot){
  return new Promise(function(resolve, reject){
    if(bot.cache.tasks && bot.cache.tasks.length > 0){
      resolve(bot)
    }

    bot.send({
      text: 'I\'m sorry, I didn\'t understand that. Can you try again?'
    })
    .then(bot => {
      bot.state.status = 'waiting';
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
     if(bid.targets.intent == bot.received.entities.intent){
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
