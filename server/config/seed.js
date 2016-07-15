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
        password: 'test'
      }, {
        provider: 'local',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin'
      })
      .then(() => {
        console.log('Users populated.');
      });
  });

Task.find({}).remove()
  .then(() => {
      Task.create({
        _id: '5786a2dc517d5513c018c9f6',
        name: 'Patient Onboarding',
        steps: [
          {
            type: 'speech',
            speech: {
              text: 'Test 123.'
            }
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
        trigger: {
          type: 'wait',
          params: {
            duration: 1,
            durationUnit: 'day'
          }
        },
        taskId: '5786a2dc517d5513c018c9f6'
      },{
        trigger: {
          type: 'repeat'
        },
        taskId: '5786a2dc517d5513c018c9f6'
      }]
    })
  })


  Question.find({}).remove()
    .then(() => {
      Question.create({
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
