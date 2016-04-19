var Aspect = require('../../../aspects');
var Entry = require('../../../entry');

export function trackAspect(conversation, response) {
  // Need: aspectType
  // Optional: link
  return {
    init: (params) => {
    },
    respond: (params) => {
    }
  }
}

export function startEntry(conversation, response) {
  // Need: aspectType
  // Optional: link
  return {
    init: (params) => {
      // ask what aspect you'd like to track
    },
    respond: (params) => {
      // route to correct function
    }
  }
}

export function addScore(conversation, response) {
  // Need: aspectId
  return {
    init: (params) => {
      return new Promise(function(resolve, reject){
        console.log('Initiating score function');
        var aspectId = response.entities.aspectId || params.aspectId;
        if(!aspectId){
          conversation.say('What would you like to track?')
          conversation.expect({
            intent: 'selectAspect',
            needed: ['aspect']
          })
        } else {
          Aspect.getById(aspectId)
          .then(aspect => {
            conversation.sayOne(aspect.questions.score); // handle better
            conversation.expect({
              intent: 'addScore',
              entities: {
                aspectId: aspectId
              },
              needed: ['number']
            })
            .then(res => resolve(res))
            .catch(err => reject(err))
          })
          .catch(err => reject(err))
        }

      })
    },
    respond: (params) => {
      if(!params){
        params = {}
      }
      var score;
      if(response.entities && response.entities.number && response.entities.number[0].value){
        score = response.entities.number[0].value;
      }
        var aspectId = response.entities.aspectId || params.aspectId;
        if(!aspectId){
          conversation.say('What would you like to track?');
          return conversation.expect({
            intent: 'addScore',
            needed: ['number']
          })
        }
        if(!score){
          conversation.say('Hey, sorry, don\'t think I understood that.');
          conversation.say('Do you mind rephrasing and trying again?');
          return conversation.expect({
            intent: 'addScore',
            needed: ['number']
          })
        }
        conversation.say('Got it, thanks!');
        conversation.addEntry({
          aspectId: response.entities.aspectId,
          score: score
        })
        return conversation.next();
    }
  }
}

export function addTriggers(conversation, response) {
  // Need aspectId
  return {
    init: (params) => {
    },
    respond: (params) => {
    }
  }
}

export function addConfidence(conversation, response, params) {
  // Need aspectId
  return {
    init: (params) => {
    },
    respond: (params) => {
    }
  }
}

export function addPriority(conversation, response, params) {
  // Need aspectId
  return {
    init: (params) => {
    },
    respond: (params) => {
    }
  }
}
