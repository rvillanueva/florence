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
            phrases: ['blah', 'hi', 'hey'],
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


export function run(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.intent) {
      getStepByIntent(bot.state.intent)
        .then(step => startStep(bot, step))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else if (bot.state.stepId) {
      getStepById(bot.state.stepId)
        .then(step => respondStep(bot, step))
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      getStepByIntent('hello')
        .then(step => startStep(bot, step))
        .then(res => resolve(res))
        .catch(err => reject(err))
    }
  })
}

export function getStepByIntent(intent) {
  return new Promise(function(resolve, reject) {
    if (intent == 'hello') {
      resolve(example.steps[0]);
    } else {
      console.log('error: why are we getting random intents?')
    }
  })

}

export function getStepById(stepId) {
  return new Promise(function(resolve, reject) {
    console.log(stepId)
    example.steps.forEach(function(step, s) {
      console.log(step._id)
      if (step._id == stepId) {
        resolve(step);
      }
    })
    resolve(false);
  })
}

export function respondStep(bot, step) {
  return new Promise(function(resolve, reject) {
    var path;
    var pattern;
    Matcher.checkPaths(bot, step.data.paths)
      .then(res => {
        pattern = res.pattern;
        path = step.data.paths[res.p];
        return bot.sayMany(pattern.messages);
      })
      .then(() => {
        if (path.next.action == 'default') {
          return runNext(bot, step.next);
        } else {
          return runNext(bot, path.next);
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

function runNext(bot, next) {
  return new Promise(function(resolve, reject) {
    bot.state.intent = null;
    bot.state.entities = {};
    bot.state.needed = [];
    if (next.action == 'goTo') {
      bot.state.stepId = next.stepId;
      bot.state.retries = 0;
    }
    if (next.action == 'end') {
      if (bot.state.mainStepId) {
        bot.state.stepId = bot.state.returnStepId;
      } else {
        bot.state.stepId = null;
      }
      bot.state.retries = 0;
    }
    if (next.action == 'retry') {
      bot.state.retries = bot.state.retries | 0;
      bot.state.retries++;
    }
    bot.updateState()
      .then(bot => getStepById(bot.state.stepId))
      .then(step => startStep(bot, step))
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

export function startStep(bot, step) {
  return new Promise(function(resolve, reject) {
    bot.state.stepId = step._id;
    bot.updateState()
      .then(res => bot.sayMany(step.data.messages))
      .then(res => resolve(res))
  })
}
