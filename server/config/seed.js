/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Program from '../models/program/program.model';
import Task from '../models/task/task.model';
import Question from '../models/question/question.model';

import mongoose from 'mongoose';

User.find({}).remove()
  .then(() => {
    User.create({
        provider: 'local',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'test',
        lastActivity: new Date()
      }, {
        provider: 'local',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin',
        lastActivity: new Date()
      })
      .then(() => {
        console.log('Users populated.');
      });
  });

Task.find({}).remove()
  .then(() => {
      Task.create({
        _id: '5786a2dc517d5513c018c9f6',
        name: 'Onboard patient',
        description: 'Initiate conversation to ensure patient understands the role, benefit, and risks of health messaging.',
        steps: [
          {
            type: 'speech',
            speech: {
              text: 'Test 123.'
            }
          }
        ]
      },
      {
        _id: '5786a2dc517d5513c018c9f8',
        name: 'Introduce diabetes program',
        description: 'Explain what to expect and program goals.',
        steps: [
          {
            type: 'speech',
            speech: {
              text: 'Hi! Hope you\'re doing well. This program is designed to help you manage your diabetes. I\'ll be checking in regularly to see how you\'re doing.'
            }
          }
        ]
      },
      {
        _id: '5786a2dc517d5513c018c9f7',
        name: 'Check blood sugar monitoring adherence for the week.',
        description: 'Check adherence to checking blood sugar as well as several warning conditions.',
        steps: [
          {
            type: 'question',
            questionId: '57891a3a678d9fcc2340954a'
          },
          {
            type: 'question',
            questionId: '57891a3a678d9fcc2340954b'
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
