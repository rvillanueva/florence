'use strict';

var Store = require('./conversation.store');
var Execute = require('./conversation.execute');
var State = require('./conversation.state');
var Selection = require('./conversation.select');

export function run(bot) {
  // look at intent and context and attach appropriate next step as stepId
  // update context
  // should probably set up some DDOS protection here too using a ready to receive flag
  return new Promise(function(resolve, reject){
    Selection.selectRef(bot)
    .then(ref => State.setNextStep(bot, ref))
    .then(step => Execute.step(bot, step))
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
