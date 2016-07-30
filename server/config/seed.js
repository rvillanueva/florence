/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../models/user/user.model';
import Program from '../models/program/program.model';
import Task from '../models/task/task.model';
import Question from '../models/question/question.model';

var moment = require('moment');

import mongoose from 'mongoose';

User.find({}).remove()
  .then(() => {
    User.create({
        providers: {
          auth: 'local'
        },
        identity: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        },
        password: 'test',
        lastActivity: new Date()
      }, {
        providers: {
          auth: 'local'
        },
        identity: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
        },
        role: 'admin',
        password: 'admin',
        lastActivity: new Date()
      },{
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
        queue: [
          {
            taskId: '5786a2dc517d5513c018c9f6',
            params: {
              providerName: 'Ryan'
            }
          },
          {
            taskId: '5786a2dc517d5513c018c9f3',
          }
        ],
        notifications:{
          nextContact: moment().subtract(10, 'days').toDate()
        },
        instructions: [
          {
            text: 'Take your amoxicillin three times a day',
            measurement: {
              type: 'propensity',
              frequency: 'daily'
            },
            action: {
              phrase: 'Take your amoxicillin',
              timing: {
                type: 'repeating',
                times: 3,
                every: 'day'
              }
            }
          }
        ],
        lastActivity: new Date()
      })
      .then(() => {
        console.log('Users populated.');
      });
  });

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
          responses: [
            {
              text: 'Great!'
            }
          ]
        },{
          match: {
            type: 'expression',
            expression: 'no'
          },
          responses: [
            {
              text: 'No problem. [ERROR: Haven\'t handled this path yet.]'
            }
          ]
        }]
      },{
        _id: '5786a2dc517d5513c018c9f6',
        name: 'Onboard patient',
        description: 'Initiate conversation to ensure patient understands the role, benefit, and risks of health messaging.',
        type: 'say',
        text: 'Hey! My name is Florence, and I work with <<providerName>>. I\'m also a bot, which means I\'m always available, but be patient with me if I don\'t understand everything!',
        params: {
          providerName: true
        }
      },
      {
        _id: '5786a2dc517d5513c018c9f3',
        name: 'Start check-in',
        description: 'Introduce check in.',
        type: 'say',
        text: 'So, I have a few questions for you that will help me keep track of your health.'
      },
      {
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
        choices: [
          {
            match: {
              type: 'number',
              min: 1,
              max: 1
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 2,
              max: 2
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 3,
              max: 3
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 4,
              max: 4
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 5,
              max: 5
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          }
        ]
      },
      {
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
        choices: [
          {
            match: {
              type: 'number',
              min: 1,
              max: 1
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 2,
              max: 2
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 3,
              max: 3
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 4,
              max: 4
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 5,
              max: 5
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          }
        ]
      },
      {
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
        choices: [
          {
            match: {
              type: 'number',
              min: 1,
              max: 1
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 2,
              max: 2
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 3,
              max: 3
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 4,
              max: 4
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'number',
              min: 5,
              max: 5
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          }
        ]
      },
      {
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
        choices: [
          {
            match: {
              type: 'number',
              min: 0,
              max: 0
            },
            responses: [{
              text: 'Great!'
            }]
          },
          {
            match: {
              type: 'number',
            },
            responses: [{
              text: 'Okay, good to know.'
            }]
          },
          {
            match: {
              type: 'expression',
              expression: 'none'
            },
            responses: [{
              text: 'Great!'
            }]
          }
        ]
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
        choices: [
          {
            match: {
              type: 'expression',
              expression: 'yes'
            },
            responses: [{
              text: 'Great!'
            }]
          },
          {
            match: {
              type: 'expression',
              expression: 'no'
            },
            responses: [{
              text: 'Okay, good to know, thanks.'
            }]
          }
        ]
      })
  })

Program.find({}).remove()
  .then(() => {
    Program.create({
      name: 'Diabetes',
      description: 'Help newly-diagnosed diabetes patients to understand diabetes and how to effectively manage their care. Track adherence to blood sugar monitoring and insulin use.',
      protocols: [{
        type: 'timed',
        params: {
          durationInDays: 1
        },
        taskId: '5786a2dc517d5513c018c9f8'
      },{
        type: 'recurring',
        params: {

        },
        taskId: '5786a2dc517d5513c018c9f7'
      }]
    })
  })


  Question.find({}).remove()
    .then(() => {
      Question.create(
        {
          _id: '57891a3a678d9fcc2340954a',
          text: 'On a scale of 1-5, how confident do you feel about checking your blood sugar before every meal?\n\n(1 = Not At All Confident and 5 = Extremely Confident)',
          choices: []
        },
        {
          _id: '57891a3a678d9fcc2340955a',
          text: 'Hey there! Do you have a second?',
          choices: []
        },
        {
        _id: '57891a3a678d9fcc2340954b',
        text: 'In the past week, have you had a blood sugar reading over 200?',
        choices: [
          {
            pattern: {
              type: 'expression',
              expressionKey: 'yes'
            }
          },
          {
            pattern: {
              type: 'expression',
              expressionKey: 'no'
            }
          }
        ]
      })
    })
