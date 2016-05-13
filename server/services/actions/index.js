'use strict';

var Track = require('../track')
import User from '../../api/user/user.model';


var actionRouter = {
  addTrack: function(bot, action) {
    return Track.add(bot, action.params)
  }
}

export function execute(bot) {
  return new Promise(function(resolve, reject) {
    var i = 0;
    if (bot.loaded.step && bot.loaded.step.actions) {
      console.log('Executing actions...')
      console.log(bot.loaded.step.actions)
      doAction(bot);
    } else {
      resolve(bot);
    }

    function doAction(bot) {
      if (i >= bot.loaded.step.actions.length) {
        console.log('Resolving...')
        resolve(bot)
      } else {
        var action = bot.loaded.step.actions[i];
        if (action.action && typeof actionRouter[action.action] == 'function') {
          var newBot;
          actionRouter[action.action](bot, action)
            .then(bot => {
              newBot = bot;
              console.log('Next action triggered!')
              User.findById(bot.userId).exec()
              .then(user => {
                console.log(user.tracked);
                next(newBot)
              })
            })
            .catch(err => reject(err))
        } else {
          console.log('Error: Unknown action ' + action.action);
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
