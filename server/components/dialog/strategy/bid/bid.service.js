'use strict';

var Promise = require('bluebird');
import Bid from '../../../../models/bid/bid.model';

// Get all active bids for user
// OUPUT: cache.bids
export function getActive(bot){
  return new Promise(function(resolve, reject){
    Bid.find({'userId': bot.user._id, 'open': true})
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

    seedEligibleTasks();
    applyBids();
    resolve(bot);

    function seedEligibleTasks(){
        for (var j = 0; j < bot.cache.tasks.length; j++){
          var task = bot.cache.tasks[j];
          task.bids = task.bids || [];
          for(var i = 0; i < bot.cache.bids.length; i ++){
            var bid = bot.cache.bids[i];
            if(objectivesMatch(task, bid)){
              task.score = 1;
            }
          }
          if(!task.score){
            task.score = 0;
          }
        }
    }

    function objectivesMatch(task, bid){
      if(task.objective == bid.target.objective){
        return true
      } else if (!task.score){
        return false
      }
    }

    function applyBids(){
      for(var i = 0; i < bot.cache.bids.length; i ++){
        var bid = bot.cache.bids[i];
        for (var j = 0; j < bot.cache.tasks.length; j++){
          var task = bot.cache.tasks[j];
          task = applyBidToTask(task, bid);
        }
      }
    }

    function applyBidToTask(task, bid){
      if(taskMatchesAllBidParams(task, bid)){
        task.force = bid.force;
        if(typeof bid.modifier === 'number'){
          task.score = task.score * bid.modifier;
        }
        task.bids.push(bid);
      }
      return task;
    }

    function taskMatchesAllBidParams(task, bid){
      var matched = true;
      var params = bid.target.params
      if(bid.target.objective && bid.target.objective !== task.objective){
        matched = false;
      }
      if(typeof params === 'object'){
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

// Fulfill from task
export function fulfillFromTask(bot){
  return new Promise(function(resolve, reject){
    var promises = [];
    if(bot.cache.task && bot.cache.task.bids){
      bot.cache.task.bids.forEach(function(bid, b){
        promises.push(fulfillOne(bid));
      })
    }

    Promise.all(promises)
    .then(() => resolve(bot))
    .catch(err => reject(err))

    function fulfillOne(bid){
      return new Promise(function(resolve, reject){
        bid.open = false;
        console.log('BID FULFILLED:')
        console.log(bid.target)
        Bid.update({'_id':bid._id}, bid)
        .then(bid => resolve(bid))
        .catch(err => reject(err))
      })
    }

  })
}
