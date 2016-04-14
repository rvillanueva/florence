// Asks for mood

var Mood = require('./mood')
var Triggers = require('../triggers')

export function enterValue(user, value, measure) {
  // save measure score
}

export function enterTrigger(user, value, text) {
  Triggers.enter(user, value, text);
}
