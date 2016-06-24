'use strict';

export default [
  {
    id: 'introduceSelf',
    execute: introduceSelf
  }
]

var introduceSelf = function(bot){
  return new Promise(function(resolve, reject){
    if(bot.settings.intro){
      bot.send({
        text: bot.settings.intro
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}
