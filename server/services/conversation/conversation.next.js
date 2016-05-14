'use strict';

var Promise = require('bluebird');

export function run(bot){
  return new Promise(function(resolve, reject){
    bot.state.current.stepId = null;

    if(bot.state.queued && bot.state.queued.length > 0){
      bot.revert()
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      bot.state.status = 'done';
      resolve(bot);
    }
  })
}
