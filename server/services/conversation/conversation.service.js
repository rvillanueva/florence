'use strict';

var Matcher = require('./conversation.match');

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
    data: {
      _id: 'abc',
      name: 'Welcome',
      measure: null,
      public: false,
      messages: [{
        type: 'text',
        text: 'Hi there!'
      }, {
        type: 'text',
        text: 'I\'m River the Robot.'
      }, {
        type: 'text',
        text: 'My purpose...'
      }],
      paths: [{
        _id: '003',
        next: {
          action: 'default'
        },
        data: {
          name: 'User says hello',
          patterns: [{
            type: 'exact',
            phrases: ['yo', 'hi', 'hey'],
            messages: [{
              type: 'text',
              text: 'Well hey there, you!'
            }, {
              type: 'text',
              text: 'Glad you\'re doing well today.'
            }]
          }]
        }
      }, {
        _id: '005',
        next: {
          action: 'retry'
        },
        data: {
          name: 'Can\'t understand user',
          patterns: [{
            type: 'catch',
            messages: [{
              type: 'text',
              text: 'Uh oh, not sure I understood!'
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
      name: 'Finish conversation',
      messages: [{
        type: 'text',
        text: 'great, glad to see you too'
      }],
    },
  }]
};


export function getStep(state) {
  return new Promise(function(resolve, reject) {
    if (state.intent) {
      getStepByIntent(state.intent)
        .then(step => resolve(step))
        .catch(err => reject(err))
    } else if (state.context.stepId) {
      getStepById(state.context.stepId)
        .then(step => resolve(step))
        .catch(err => reject(err))
    } else {
      getStepByIntent('hello')
        .then(step => resolve(step))
        .catch(err => reject(err))
    }
  })
}

export function getStepByIntent(intent) {

}

export function getStepById(stepId) {
  return new Promise(function(resolve, reject) {
    example.steps.forEach(function(step, s) {
      if (step._id == stepId) {
        resolve(step);
      }
    })
  })
}

export function respondStep(bot) {
  return new Promise(function(resolve, reject){
    var step;
    var path;
    var pattern;
    getStep(bot.state)
      .then(stepData => {
        return new Promise(function(resolve, reject){
          step = stepData;
          resolve()
        })
      })
      .then(Matcher.checkPaths(step.paths))
      .then(res => {
        pattern = res.pattern;
        path = step.paths[res.p];
        return bot.sendMany(pattern.messages);
      })
      .then(()=> {
        if(path.next.action == 'default'){
          return runNext(step.next);
        } else {
          return runNext(path.next);
        }
      })
      .then(res => resolve(res))
      .catch(err => reject(err))
        // match pattern
        // send messages from pattern
        // update state for next step
        // return bot
  })

}

function runNext(next){
  return new Promise(function(resolve, reject){
    if(next.action == 'goTo'){
      bot.state.stepId = next.stepId;
      bot.updateState()
      .then(bot => startStep(bot))
      .then(res => resolve(res))
      .catch(err => reject(err))
    }
  })
}

export function startStep(bot, step) {
  return new Promise(function(resolve, reject){
    getStep(bot.state)
      .then(step => {})
  })
}
