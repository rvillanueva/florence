'use strict';

var Track = require('../track')
import User from '../../api/user/user.model';
var CheckIn = require('../checkin')


var actionRouter = {
  addTrack: function(bot, action) {
    return Track.add(bot, action.params)
  },
  removeAllTracks: function(bot, action) {
    return Track.removeAll(bot, action.params)
  },
  queueCheckin: function(bot, action) {
    return CheckIn.queue(bot, action.params)
  }
}

export function execute(bot) {
  return new Promise(function(resolve, reject) {
    var i = 0;
    if (bot.loaded.step && bot.loaded.step.actions) {
      console.log('Executing ' + bot.loaded.step.actions.length + ' actions...')
      doAction(bot);
    } else {
      resolve(bot);
    }

    function doAction(bot) {
      if (i >= bot.loaded.step.actions.length) {
        resolve(bot)
      } else {
        var action = bot.loaded.step.actions[i];
        if (action.type && typeof actionRouter[action.type] == 'function') {
          var newBot;
          actionRouter[action.type](bot, action)
            .then(bot => next(bot))
            .catch(err => reject(err))
        } else {
          console.log('Error: Unknown action ' + action.type);
          next(bot);
        }
      }
    }

    function next(bot){
      i++;
      doAction(bot)
    }
  })
}
