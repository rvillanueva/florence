'use strict';

var Promise = require('bluebird');
var Metric = require('../../api/metric/metric.service');

// Add item to track. Needs aspect and frequency
export function add(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.intent !== 'track'){
      reject('Intent ' + bot.state.intent + ' is not correct.');
    }
    if(!bot.state.entities.aspect || !bot.state.entities.frequency){
      reject('Needs aspect.');
    }
    var tracked = {
      aspectId: null,
      frequency: null
    }
    Aspect.getByKey(bot.state.entities.aspect)
    .then(aspect => {
      if(!aspect){
        reject('No aspect with key ' + bot.state.entities.aspect + ' found.')
      }
      tracked.aspectId = aspect._id;
      tracked.frequency = bot.state.entities.frequency;
      bot.getUser()
      .then(user => {
        user.tracking = user.tracking || [];
        var alreadyTracked = false;
        user.tracked.forEach(function(track, t){
          if(tracked.aspectId == track.aspectId){
            alreadyTracked = true;
            user.tracked.splice(t, 1);
          }
        })
        user.tracked.push(tracked);
        resolve(bot);
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))

    // get aspect key and match to aspect Id
    // log frequency
    // confirm timezone
  })
}

export function remove(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.intent !== 'stopTrack'){
      reject('Intent ' + bot.state.intent + ' is not correct.');
    }
  })
}

export function removeAll(bot){

}
