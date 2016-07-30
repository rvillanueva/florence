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
            taskId: '5786a2dc517d5513c018c9f6'
          }
        ],
        notifications:{
          nextContact: moment().subtract(10, 'days').toDate()
        },
        instructions: [
          {
            text: String,
            measurement: {
              type: 'propensity',
              frequency: 'daily'
            },
            action: {
              phrase: 'Take your amoxciillin',
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
              text: 'Yes oh yes!'
            }
          ]
        },{
          match: {
            type: 'expression',
            expression: 'no'
          },
          responses: [
            {
              text: 'No way, Jose!'
            }
          ]
        }]
      },{
        _id: '5786a2dc517d5513c018c9f6',
        name: 'Onboard patient',
        description: 'Initiate conversation to ensure patient understands the role, benefit, and risks of health messaging.',
        type: 'say',
        text: 'Test123.'
      },
      {
        name: 'Measure weekly propensity',
        objective: 'measureInstruction',
        type: 'ask',
        text: 'How often do you feel like you <<actionPhrase>>? (Never, rarely, sometimes, usually, always)',
        attributes: {
          measurementType: 'propensity',
          measurementFreq: 'daily'
        },
        params: {
          actionPhrase: true
        }
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
