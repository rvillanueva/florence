'use strict';

var Execute = require('./conversation.execute');
var State = require('./conversation.state');
var Selection = require('./conversation.select');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Running conversation...')
    Selection.selectRef(bot)
    .then(ref => State.setNextStep(bot, ref))
    .then(bot => Execute.step(bot))
    .then(bot => loop(bot))
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}

function loop(bot){
  if(bot){
    run(bot)
    .then(res => resolve(res))
    .catch(err => reject(err))
  } else {
    resolve(true);
  }
}
