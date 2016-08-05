/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../models/user/user.model';
import Program from '../models/program/program.model';
import Task from '../models/task/task.model';
import Question from '../models/question/question.model';
import Entry from '../models/entry/entry.model';
import mongoose from 'mongoose';

var InstructionService = require('../services/instruction');
var Promise = require('bluebird');
var moment = require('moment');
var generator = require('./generator');

var setUsers = [];

Entry.find({}).remove()
  .then(() => {
    Entry.create([{
        userId: '5786a2dc517d5513c018c9d0',
        meta: {
          taskId: '579d4ba1e724a92ab1a8646e',
          params: {
            timingEvery: 'day',
            timingTimes: 3,
            timingType: 'repeating',
            actionPhrase: 'take your amoxicillin',
            measurementPeriod: 'day',
            measurementType: 'propensity',
            instructionId: '579d4ba1e724a92ab1a864a1'
          },
          prompt: 'On a scale of 1-5, how often do you take your amoxicillin?',
          created: moment().subtract(5, 'days')
        },
        value: {
          number: 1
        },
        response: {
          content: {
            text: '1'
          }
        }
      }, {
        userId: '5786a2dc517d5513c018c9d0',
        meta: {
          taskId: '579d4ba1e724a92ab1a8646e',
          params: {
            timingEvery: 'day',
            timingTimes: 3,
            timingType: 'repeating',
            actionPhrase: 'Take your amoxicillin',
            measurementPeriod: 'day',
            measurementType: 'propensity',
            instructionId: '579d4ba1e724a92ab1a864a1'
          },
          prompt: 'On a scale of 1-5, how often do you take your amoxicillin?',
          created: moment().subtract(1, 'day')
        },
        value: {
          number: 4
        },
        response: {
          content: {
            text: '1'
          }
        }
      }, {
        userId: '5786a2dc517d5513c018c9d0',
        meta: {
          taskId: '579d4ba1e724a92ab1a8646e',
          params: {
            timingEvery: 'day',
            timingTimes: 3,
            timingType: 'repeating',
            actionPhrase: 'Take your amoxicillin',
            measurementPeriod: 'day',
            measurementType: 'propensity',
            instructionId: '579d4ba1e724a92ab1a864a1'
          },
          prompt: 'On a scale of 1-5, how often do you take your amoxicillin?',
          created: moment().subtract(2, 'days')
        },
        value: {
          number: 3
        },
        response: {
          content: {
            text: '1'
          }
        }
      }])
      .then(() => User.find({}).remove())
      .then(() => User.create([{
        _id: '5786a2dc517d5513c018c9d0',
        providers: {
          auth: 'local',
          messaging: 'sms'
        },
        identity: {
          firstName: 'Ryan',
          lastName: 'Villanueva',
          email: 'ryan@florence.ai',
          mobile: '+14154123689'
        },
        active: true,
        role: 'admin',
        password: 'admin',
        queue: [{
          taskId: '5786a2dc517d5513c018c9f6',
          params: {
            providerName: 'Ryan'
          }
        }, {
          taskId: '5786a2dc517d5513c018c9f3',
        }],
        notifications: {
          nextContact: moment().subtract(10, 'days').toDate()
        },
        instructions: [{
          _id: '579d4ba1e724a92ab1a864a1',
          text: 'Take your amoxicillin three times a day',
          measurement: {
            type: 'propensity',
            frequency: 'daily',
            period: 'day'
          },
          action: {
            phrase: 'take your amoxicillin',
            timing: {
              type: 'repeating',
              times: 3,
              every: 'day'
            }
          }
        }],
        lastActivity: new Date()
      },{
        _id: '5786a2dc517d5513c018c9d1',
        providers: {
          auth: 'local',
          messaging: 'sms'
        },
        identity: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'admin@example.com'
        },
        active: true,
        role: 'admin',
        password: 'admin',
        queue: [],
        notifications: {
          nextContact: moment().subtract(10, 'days').toDate()
        },
        instructions: [{
          _id: '579d4ba1e724a92ab1a864a1',
          text: 'Take your diabetes medication three times a day',
          measurement: {
            type: 'propensity',
            frequency: 'daily',
            period: 'day'
          },
          action: {
            phrase: 'take your diabetes medication',
            timing: {
              type: 'repeating',
              times: 3,
              every: 'day'
            }
          }
        }],
        lastActivity: new Date()
      }]))
      .then(returned => {
        setUsers = returned;
        var users = generator.users({
          quantity: 10
        })
        return User.create(users)
      })
      .then(returned => {
        var users = setUsers.concat(returned);
        console.log('Generating entries for ' + users.length + ' users')
        return generator.entries({
          users: users
        })
      })
      .then(entries => createEntries(entries))
      .then(() => {
        console.log('Users and entries populated.');
      });

  })

  function createEntries(entries){
    return new Promise(function(resolve, reject){
      var promises = []
      entries.forEach(function(entry, e){
        promises.push(createOneEntry(entry))
      })
      Promise.all(promises)
      .then(() => resolve(true))
      .catch(err => reject(err))
    })
  }

  function createOneEntry(entry){
    return new Promise(function(resolve, reject){
      Entry.create(entry)
      .then(entry => InstructionService.updateAdherenceScore(entry.meta.params.instructionId))
      .then(() => resolve(true))
      .catch(err => reject(err))
    })
  }


Task.find({}).remove()
  .then(() => {
    Task.create({
      _id: '5786a2dc517d5513c018c9e0',
      name: 'Initiate',
      objective: 'initiate',
      description: 'The greeting to initiate a patient interaction.',
      type: 'ask',
      text: 'Hi! Do you have a second?',
      choices: [{
        match: {
          type: 'expression',
          expression: 'yes'
        },
        responses: [{
          text: 'Great!'
        }]
      }, {
        match: {
          type: 'expression',
          expression: 'no'
        },
        responses: [{
          text: 'No problem. [ERROR: Haven\'t handled this path yet.]'
        }]
      }]
    },{
      name: 'Initiate',
      objective: 'initiate',
      description: 'The greeting to initiate a patient interaction.',
      type: 'ask',
      text: 'Hey! Quick question for you--is now a good time?',
      choices: [{
        match: {
          type: 'expression',
          expression: 'yes'
        },
        responses: [{
          text: 'Great!'
        }]
      }, {
        match: {
          type: 'expression',
          expression: 'no'
        },
        responses: [{
          text: 'No problem. [ERROR: Haven\'t handled this path yet.]'
        }]
      }]
    }, {
      objective: 'systemOnboard',
      name: 'Onboard patient',
      description: 'Initiate conversation to ensure patient understands the role, benefit, and risks of health messaging.',
      type: 'ask',
      text: 'Hey! My name is Florence, and I work with <<providerName>> to stay in touch with our patients. I\'m also a bot, which means I\'m always available, but be patient with me if I don\'t understand everything! Are you okay with me checking in with you from time to time?',
      params: {
        providerName: true
      },
      choices: [{
        match: {
          type: 'expression',
          expression: 'yes'
        },
        responses: [{
          text: 'Great!'
        }]
      }, {
        match: {
          type: 'expression',
          expression: 'no'
        },
        responses: [{
          text: 'No problem. [ERROR: Haven\'t handled this path yet.]'
        }]
      }]
    }, {
      _id: '5786a2dc517d5513c018c9f6',
      objective: 'systemOnboard',
      name: 'Onboard patient',
      description: 'Initiate conversation to ensure patient understands the role, benefit, and risks of health messaging.',
      type: 'say',
      text: 'Hey! My name is Florence, and I help our team stay in touch with our patients. I\'m also a bot, which means I\'m always available, but be patient with me if I don\'t understand everything!',
      params: {
        providerName: true
      }
    }, {
      _id: '5786a2dc517d5513c018c9f3',
      objective: 'startCheckIn',
      name: 'Start check-in',
      description: 'Introduce check in.',
      type: 'say',
      text: 'So, I have a few questions for you that will help me keep track of your health.'
    }, {
      name: 'Measure daily propensity',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'Today, on a scale of 1-5, how often do you feel like you have been able to <<actionPhrase>>? (1 = Never, 5 = Always)',
      attributes: {
        measurementType: 'propensity',
        measurementPeriod: 'day'
      },
      params: {
        actionPhrase: true
      },
      choices: [{
        match: {
          type: 'number',
          min: 1,
          max: 1
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 2,
          max: 2
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 3,
          max: 3
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 4,
          max: 4
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 5,
          max: 5
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }]
    }, {
      name: 'Measure weekly propensity',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'This week, on a scale of 1-5, how often do you feel like you have been able to <<actionPhrase>>? (1 = Never, 5 = Always)',
      attributes: {
        measurementType: 'propensity',
        measurementPeriod: 'week'
      },
      params: {
        actionPhrase: true
      },
      choices: [{
        match: {
          type: 'number',
          min: 1,
          max: 1
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 2,
          max: 2
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 3,
          max: 3
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 4,
          max: 4
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 5,
          max: 5
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }]
    }, {
      name: 'Measure general propensity',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'On a scale of 1-5, how often do you feel like you <<actionPhrase>>? (1 = Never, 5 = Always)',
      attributes: {
        measurementType: 'propensity'
      },
      params: {
        actionPhrase: true
      },
      choices: [{
        match: {
          type: 'number',
          min: 1,
          max: 1
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 2,
          max: 2
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 3,
          max: 3
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 4,
          max: 4
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'number',
          min: 5,
          max: 5
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }]
    }, {
      name: 'Measure missed frequency this week',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'This week, how many times did you miss a scheduled time to <<actionPhrase>>?',
      attributes: {
        measurementType: 'missedFrequency',
        measurementPeriod: 'week'
      },
      params: {
        actionPhrase: true
      },
      choices: [{
        match: {
          type: 'number',
          min: 0,
          max: 0
        },
        responses: [{
          text: 'Great!'
        }]
      }, {
        match: {
          type: 'number',
        },
        responses: [{
          text: 'Okay, good to know.'
        }]
      }, {
        match: {
          type: 'expression',
          expression: 'none'
        },
        responses: [{
          text: 'Great!'
        }]
      }]
    }, {
      name: 'Measure missed frequency today',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'Today, how many times did you miss a scheduled time to <<actionPhrase>>?',
      attributes: {
        measurementType: 'missedFrequency',
        measurementPeriod: 'day'
      },
      params: {
        actionPhrase: true
      }
    }, {
      name: 'Measure completed frequency this week',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'This week, how many times did you <<actionPhrase>>?',
      attributes: {
        measurementType: 'completedFrequency',
        measurementPeriod: 'week'
      },
      params: {
        actionPhrase: true
      }
    }, {
      name: 'Measure completed frequency today',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'Today, how many times did you <<actionPhrase>>?',
      attributes: {
        measurementType: 'completedFrequency',
        measurementPeriod: 'day'
      },
      params: {
        actionPhrase: true
      }
    }, {
      name: 'Measure future confidence',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'On a scale of 1-5, how confident are you that you will be able to <<actionPhrase>>? (1 = Not at all confident, 5 = Extremely confident)',
      attributes: {
        measurementType: 'futureConfidence',
      },
      params: {
        actionPhrase: true
      }
    }, {
      name: 'Measure task completion',
      objective: 'measureInstruction',
      type: 'ask',
      text: 'Were you able to <<actionPhrase>>?',
      attributes: {
        measurementType: 'taskCompletion',
      },
      params: {
        actionPhrase: true
      },
      choices: [{
        match: {
          type: 'expression',
          expression: 'yes'
        },
        responses: [{
          text: 'Great!'
        }]
      }, {
        match: {
          type: 'expression',
          expression: 'no'
        },
        responses: [{
          text: 'Okay, good to know, thanks.'
        }]
      }]
    })
  })
