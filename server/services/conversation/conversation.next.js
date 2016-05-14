'use strict';

var Promise = require('bluebird');

export function run(bot){
  return new Promise(function(resolve, reject){
    bot.state.step.id = null;

    if(bot.state.step.diverted && bot.state.step.diverted.length > 0){
      bot.revert()
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      bot.state.status = 'done';
      resolve(bot);
    }
  })
}
