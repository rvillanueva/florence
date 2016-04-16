var Aspect = require('../../../aspects');

export function trackAspect(conversation, response) {
  // Need: aspectType
  // Optional: link
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}

export function addScore(conversation, response) {
  // Need: aspectId
  return {
    respond: (params) => {
        if(!params || !params.score){
          conversation.say('Hey, sorry, don\'t think I understood that.');
          conversation.say('Do you mind rephrasing and trying again?');
          return conversation.expect({
            intent: 'addScore',
            needed: ['score']
          })
        }
        conversation.say('Got it, thanks.');
        return Entry.add({
          aspectId: params.aspectId,
          score: params.score
        })
    },
    init: (params) => {
      return new Promise(function(resolve, reject){
        console.log('Initiating score function');
        Aspect.getById(params.aspectId)
        .then(aspect => {
          conversation.sayOne(aspect.questions.score); // handle better
          conversation.expect({
            intent: 'addScore',
            params: {
              aspectId: aspect._id
            },
            needed: ['number']
          })
          .then(res => resolve(res))
          .catch(err => reject(err))
        })
        .catch(err => reject(err))
      })
      /*if(!params.aspectId){
        conversation.say('What would you like to track?');
        // requires aspectId for a measure
      }*/
    },
  }
}

export function addTriggers(conversation, response) {
  // Need aspectId
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}

export function addConfidence(conversation, response, params) {
  // Need aspectId
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}

export function addPriority(conversation, response, params) {
  // Need aspectId
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}
