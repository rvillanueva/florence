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

      })
  })

Program.find({}).remove()
  .then(() => {
    Program.create({
      name: 'Antibiotics',
      bids: [{
        target: {
          taskId: '5776dfb33308891e1250e6f8'
        }
      },{
        target: {
          taskId: '5776dfb33308891e1250e6f9'
        }
      }]
    })
  })
