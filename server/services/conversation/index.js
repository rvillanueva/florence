'use strict';

var Execute = require('./conversation.execute');
var Sort = require('./conversation.sort');
var Receive = require('./conversation.receive');
var Next = require('./conversation.next')

export function run(bot) {
  return new Promise(function(resolve, reject) {
    if(bot.loaded.step){
      bot.state.status = 'conversing';
      Execute.fire(bot)
        .then(bot => Sort.selectExecuteStep(bot))
        .then(bot => run(bot))
        .then(bot => clearCache(bot))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else if(bot.state.status == 'checkingin'){
    } else if (Next.hasQueue(bot)){
      Next.revert(bot)
      .then(bot => run(bot))
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

function clearCache(bot){
  return new Promise(function(resolve, reject) {
    bot.cache = {};
    resolve(bot);
  })
}
