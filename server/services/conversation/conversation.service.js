'use strict';

var Store = require('./conversation.store');
var Execute = require('./conversation.execute');
var State = require('./conversation.state');
var Selection = require('./conversation.select');

export function run(bot) {
  return new Promise(function(resolve, reject) {
    Selection.selectRef(bot)
    .then(ref => State.setNextStep(bot, ref))
    .then(bot => Execute.step(bot))
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
