'use strict';

export function clearStep(bot){ // This should probably be a bot function
  return new Promise(function(resolve, reject) {
    bot.loaded.step = false;
    resolve(bot);
  })
}
