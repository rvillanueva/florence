// Asks for mood

var Mood = require('./mood')
var Triggers = require('../triggers')

export function logValue(conversation) {
  // save measure score
  var context = {
    intent: 'logValue',
    needed: {
      entities: [
        'score'
      ]
    }
  }

  return {
    context: context,
    respond: (action) => {

    },
    start: () => {
      conversation.say('Okay, let\'s get started.')
      conversation.say('On a scale of 1 (the worst) to 10 (the best) are you feeling right now?')
    }
  }
}

export function logValue(action) {
  Triggers.enter(user, value, text);
}
