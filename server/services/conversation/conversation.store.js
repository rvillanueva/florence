'use strict';

var example = {
  _id: 'test',
  info: {
    name: 'Intro'
  },
  steps: [{
    _id: '001',
    aliasOfId: 'abc',
    next: {
      action: 'goTo',
      stepId: '002'
    },
    retries: {
      max: 3,
      replies: ['So really, should I tell you?','Do you want to hear the answer or not?'],
      next: {
        action: 'goTo',
        stepId: '002'
      }
    },
    data: {
      _id: 'abc',
      name: 'Welcome',
      measure: null,
      public: false,
      messages: [{
        type: 'text',
        text: 'Oh hey there!'
      }, {
        type: 'text',
        text: 'I\'m River, and I\'m learning to be a personal care companion.'
      }, {
        type: 'text',
        text: 'Even though I\'m still training, there are a few things I can do. Want to hear them?'
      }],
      paths: [{
        _id: 'p001',
        next: {
          action: 'default'
        },
        data: {
          name: 'User accepts',
          patterns: [{
            type: 'exact',
            phrases: ['yes', 'yea', 'sure'],
            messages: [{
              type: 'text',
              text: 'Great!'
            }, {
              type: 'text',
              text: 'Here\'s my magic...'
            }]
          }]
        }
      },{
        _id: 'p002',
        next: {
          action: 'goTo',
          stepId: '003'
        },
        data: {
          name: 'User declines',
          patterns: [{
            type: 'exact',
            phrases: ['no', 'no way', 'nah'],
            messages: [{
              type: 'text',
              text: 'You make me sad :('
            }, {
              type: 'text',
              text: 'Fare thee well.'
            }]
          }]
        }
      },{
        _id: 'p003',
        next: {
          action: 'retry'
        },
        data: {
          name: 'Can\'t understand user',
          patterns: [{
            type: 'exact',
            phrases: ['you\'re stupid'],
            messages: [{
              type: 'text',
              text: 'So are you, but that doesn\'t answer my question....'
            }]
          }]
        }
      }]
    }
  }, {
    _id: '002',
    aliasOfId: null,
    next: {
      action: 'end'
    },
    data: {
      name: 'Pre-ending',
      messages: [{
        type: 'text',
        text: 'And this is almost the end of the conversation!'
      }],
    },
  },
  {
    _id: '003',
    aliasOfId: null,
    next: {
      action: 'goTo',
      stepId: '004'
    },
    data: {
      name: 'Fake finish',
      messages: [{
        type: 'text',
        text: 'Goodbye!'
      }],
    },
  },
  {
    _id: '004',
    aliasOfId: null,
    next: {
      action: 'end'
    },
    data: {
      name: 'Finish conversation',
      messages: [{
        type: 'text',
        text: 'Hah jk lol!'
      }],
    },
  }]
};

export function getStepByIntent(intent) {
  return new Promise(function(resolve, reject) {
    if (intent == 'intro') {
      resolve(example.steps[0]);
    } else if(intent == 'hello') {
      resolve(example.steps[0]);
    } else {
      console.log('error: why are we getting random intents?')
    }
  })
}

export function getStepById(stepId) {
  return new Promise(function(resolve, reject) {
    example.steps.forEach(function(step, s) {
      if (step._id == stepId) {
        resolve(step);
      }
    })
    resolve(false);
  })
}
