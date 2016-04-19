/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Aspect from '../api/aspect/aspect.model';

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

  Aspect.find({}).remove()
    .then(() => {
      Aspect.create({
        key: 'mood',
        name: 'mood',
        type: 'outcome',
        scale: {
          min: 1,
          max: 10
        },
        questions: {
          score: ['On a scale of 1 to 10, how do you feel right now?'],
          trigger: ['What sort of things are making you feel better or worse?']
        }
      },
      {
        key: 'anxiety',
        name: 'anxiety',
        type: 'outcome',
        scale: {
          min: 1,
          max: 10
        },
        questions: {
          score: ['On a scale of 1 to 10, how do is your anxiety right now?'],
          trigger: ['What sort of things are making you more or less anxious?']
        }
      })
      .then(() => {
        console.log('Aspects populated.');
      });
    });
