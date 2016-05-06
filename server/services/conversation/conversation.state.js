'use strict';

export function clear(bot){ // This should probably be a bot function
  return new Promise(function(resolve, reject) {
    bot.ref = null;
    bot.state.received.intent = null;
    resolve(bot);
  })
}
