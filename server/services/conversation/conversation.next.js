'use strict';

var Promise = require('bluebird');

export function run(bot){
  return new Promise(function(resolve, reject){
    console.log('Finding next...')
    bot.state.current = null;
    console.log(bot.state.queued);
    if(bot.state.queued && bot.state.queued.length > 0){
      console.log('Reverting to next in queue...')
      bot.next()
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      console.log('Done.')
      bot.state.status = 'done';
      resolve(bot);
    }
  })
}
