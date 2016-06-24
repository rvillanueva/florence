'use strict';

var Promise = require('bluebird');
import Bids from './bid.model';

// Get all active bids for user
// OUPUT: cache.bids
export function getActive(bot){
  return new Promise(function(resolve, reject){
    Bids.find({'userId': bot.user._id})
      .then(bids => {
        bot.cache.bids = bids;
        console.log('BIDS')
        console.log(bids);
        resolve(bot)
      })
      .catch(err => reject(err))
  })
}


// Apply each bid to the task map
// INPUT: cache.tasks, cache.bids
// OUPUT: cache.tasks

export function applyEachBid(bot){
  return new Promise(function(resolve, reject){
    for(var i = 0; i < bot.cache.bids.length; i ++){
      var bid = bot.cache.bids[i];
      for (var j = 0; j < bot.cache.tasks.length; j++){
        var task = bot.cache.tasks[j];
        task = applyBid(task, bid);
      }
    }
    resolve(bot)

    function applyBid(task, bid){
      if(!task.score){
        task.score = 1;
      }
      if(isMatch(task, bid)){
        task.force = bid.force;
        if(typeof bid.modifier === 'number'){
          task.score = task.score * bid.modifier;
        }
        return task;
      }
    }

    function isMatch(task, bid){
      var matched = true;
      var params = bid.target.params
      if(bid.target.objective && bid.target.objective !== task.objective){
        matched = false;
      }
      if(params){
        for (var param in params) {
          if (params.hasOwnProperty(param)) {
            if (bot.response.result.parameters[param] !== bid.target.params[param] && bid.target.params[param] !== '*') {
              matched = false;
            }
          }
        }
      }
      return matched;
    }
  })
}
