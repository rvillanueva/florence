var Measures = require('../../measures');
var Triggers = require('../../triggers');

export function logValue(conversation) {
  return {
    respond: (entities) => {
      /*Entry.log({
        measure: 'mood',
        value: action.entities.value
      })*/
      conversation.say('Got it--thank you.')
      conversation.next();
    },
    init: (entities) => {
      conversation.say('On a scale of 1 (the worst) to 10 (the best), how are you feeling right now?')
      conversation.expect({
        intent:'logValue',
        entities: {
          measure: 'mood'
        },
        expected:['score']
      })
    },
  }
}

export function logTrigger(conversation) {
  return {
    respond: (entities) => {
      if(!entities.text){
        //clarify
      } else {
        Entry.log({
          measure: 'mood',
          triggers: entities.text
        });
      }
    },
    init: (entities) => {
      conversation.say('On a scale of 1 (the worst) to 10 (the best), how are you feeling right now?');
      conversation.expect({
        intent:'logValue',
        entities: {
          measure: 'mood'
        }
      })
    },
  }
}
