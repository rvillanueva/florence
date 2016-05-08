'use strict';

var Execute = require('./conversation.execute');
var Ref = require('./conversation.ref');
var Receive = require('./conversation.receive');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    if(bot.loaded.step){
      bot.state.status = 'executing';
      Execute.fire(bot)
        .then(bot => Ref.selectExecuteStep(bot))
        .then(bot => run(bot))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      console.log('Loop ended.')
      bot.state.status = 'waiting';
      bot.updateState()
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    }
  })
}

export function receive(bot) {
  return new Promise(function(resolve, reject) {
    bot.state.status = 'receiving';
    Receive.getResponse(bot)
      .then(bot => run(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}
