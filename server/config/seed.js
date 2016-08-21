/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../models/user/user.model';
import Intent from '../models/intent/intent.model';

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });

Intent.find({}).remove()
  .then(() => {
    Intent.create({
      name: 'Check coverage',
      responses: [{
        description: 'Return coverage',
        conditions: {
          insuranceLoaded: true
        },
        say: ['Okay, let\'s see if you have coverage...'],
        actions: [{
          key: 'getCoverage'
        }]
      }]
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
