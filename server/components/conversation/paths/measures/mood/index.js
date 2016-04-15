var Measures = require('../../measures');
var Triggers = require('../../triggers');

export function logScore(conversation) {
  return {
    respond: (entities) => {
        conversation.say('Got it--thank you.')
        return conversation.next();

      /*Entry.log({
        measure: 'mood',
        value: action.entities.value
      })*/
    },
    init: (entities) => {
      conversation.say('On a scale of 1 (the worst) to 10 (the best), how are you feeling right now?')
      return conversation.expect({
        intent:'logScore',
        entities: {
          measure: 'mood'
        },
        expected:['score']
      })
    }
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
      return conversation.expect({
        intent:'logTrigger',
        entities: {
          measure: 'mood'
        }
      })
    },
  }
}
