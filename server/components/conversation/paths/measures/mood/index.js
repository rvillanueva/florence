var Measures = require('../../measures');
var Triggers = require('../../triggers');

export function logScore(conversation) {
  return {
    respond: (entities) => {
        conversation.say('Got it--thank you.')
        return logTriggers(conversation).init(entities);

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

export function logTriggers(conversation) {
  return {
    respond: (entities) => {
      console.log(entities)
      if(!entities || !entities.text){
        conversation.say('Uh oh, I\'m afraid I didn\'t understand that one. Was there message text?');
        return conversation.expect({
          intent:'logTriggers',
          entities: {
            measure: 'mood'
          }
        })
      } else {
        /*Entry.log({
          measure: 'mood',
          triggers: entities.text
        });*/
        conversation.say('Great! That\'s all I have for now – stay tuned!');
        return conversation.next();
      }
    },
    init: (entities) => {
      conversation.say('Has there been anything that\'s been making you feel better or worse?');
      conversation.say('If you want, you can use #hashtags to keep track of specific things over time.');
      return conversation.expect({
        intent:'logTriggers',
        entities: {
          measure: 'mood'
        }
      })
    },
  }
}
