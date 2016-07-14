/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Program from '../models/program/program.model';
import Task from '../models/task/task.model';
import Bid from '../models/bid/bid.model';

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
