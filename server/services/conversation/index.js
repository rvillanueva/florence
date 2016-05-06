'use strict';

var Execute = require('./conversation.execute');
var State = require('./conversation.state');
var Selection = require('./conversation.select');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    console.log('\n\n\n\nStarting new step...')
    Selection.selectRef(bot)
    .then(bot => Execute.step(bot))
    .then(bot => State.clear(bot))
    .then(bot => loop(bot))
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}

function loop(bot){
  if(bot.state.status == 'executing'){
    run(bot)
    .then(res => resolve(res))
    .catch(err => reject(err))
  } else {
    bot.updateState()
    .then(bot => resolve(bot))
  }
}
