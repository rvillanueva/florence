'use strict';

var Promise = require('bluebird');

export function notify(bot){
  return new Promise(function(resolve, reject){
    bot.send({
      text: 'Hey'
    })
    .then(bot => bot.setStatus('waiting'))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
