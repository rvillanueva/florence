var Aspects = require('../../../aspects');
var Entry = require('../../../entry');
var Paths = require('../../paths');

Paths.add('trackAspect', function(conversation, response) {
  // Need: aspectType
  // Optional: link
  this.init = function(params) {
    return new Promise((resolve, rejct) => {
      conversation.say('Here are some of the things I can help you with. Let me know if you\'re interested in any of them!');
      var aspectCards = [];
      Aspects.getOutcomes()
        .then(aspects => {
          console.log('ASPECTS')
          console.log(aspects)
          aspects.forEach((aspect, i) => {
            var card = {
              title: aspect.callToAction.title,
              //image_url: aspect.imageUrl,
              subtitle: aspect.callToAction.subtitle,
              buttons: [{
                type: 'postback',
                title: 'Start',
                payload: {
                  intent: 'trackAspect',
                  entities: {
                    aspectId: aspect._id
                  }
                }
              }]
            }
            aspectCards.push(card);
          })
          conversation.cards(aspectCards);
          conversation.expect({
              intent: 'trackAspect'
            })
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
  this.respond = function(params) {
    return new Promise((resolve, reject) => {
      if (response.entities.aspectId) {
        addScore(conversation, response).init({
          aspectId: response.entities.aspectId
        });
        resolve();
      } else {
        conversation.say('Oh shoot! Don\'t think I caught that – can you try again?');
        conversation.expect('trackAspect');
        resolve();
      }
    })
  }
})

Paths.add('addScore', function(conversation, response) {
  // Need: aspectId
  this.start = function() {
    return new Promise(function(resolve, reject) {
      console.log('Initiating score function');
      var aspectId = response.entities.aspectId;
      console.log(aspectId)
      if (!aspectId) {
        conversation.say('What would you like to track?')
        conversation.wait();
        resolve();
      } else {
        Aspects.getById(aspectId)
          .then(aspect => {
            conversation.sayOne(aspect.questions.score); // handle better
            return conversation.wait({ aspectId: aspectId})
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      }

    })
  }
  this.needed = ['number','aspectId'];
  this.respond = function() {
    var score;
    if (response.entities && response.entities.number && response.entities.number[0].value) {
      score = response.entities.number[0].value;
    }
    var aspectId = response.entities.aspectId;
    if (!aspectId) {
      conversation.say('What would you like to track?');
      return conversation.wait()
    }
    if (!score) {
      conversation.say('Hey, sorry, don\'t think I understood that.');
      conversation.say('Do you mind rephrasing and trying again?');
      return conversation.wait();
    }
    conversation.say('Got it, thanks!');
    conversation.entry({
      aspectId: response.entities.aspectId,
      score: score
    })
    return conversation.next();
  }
  return this;
})
