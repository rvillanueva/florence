'use strict';

import User from '../../models/user/user.model';
var moment = require('moment');

var firstNames = [
  'Estrella',
  'Blanch',
  'Marlon',
  'Merri',
  'Bridgett',
  'Sally',
  'Brittney',
  'Nina',
  'Hilde',
  'Collin',
  'Rueben',
  'Estella',
  'Pam',
  'Dan',
  'Winfred',
  'Telma',
  'Constance',
  'Keturah',
  'Marguerite',
  'Venice'
]
var lastNames = [
  'Roebuck',
  'Thomas',
  'Schoenberger',
  'Styer',
  'Samford',
  'Rough',
  'Enger',
  'Sanders',
  'Mccuen',
  'Amado',
  'Brown',
  'Hegna',
  'Smith',
  'Boltz',
  'Hellwig',
  'Bamburg',
  'Keppler',
  'Kral',
  'Kimler'
]
var instructionIndex = {
  antibioticPickup: {
    text: 'Pick up your doxycycline from the pharmacy',
    measurement: {
      type: 'futureConfidence',
      frequency: 'weekly',
      period: 'week'
    },
    action: {
      phrase: 'pick up your doxycycline',
      timing: generateOnceTiming()
    }
  },
  antibiotics: {
    text: 'Take your doxycycline three times a day',
    measurement: {
      type: 'propensity',
      frequency: 'daily',
      period: 'day'
    },
    action: {
      phrase: 'take your doxycycline',
      timing: {
        type: 'repeating',
        times: 3,
        every: 'day'
      }
    }
  },
  inhaler: {
    text: 'User your inhaler as needed',
    measurement: {
      type: 'propensity',
      frequency: 'weekly',
      period: 'week'
    },
    action: {
      phrase: 'use your inhaler as needed'
    }
  },
  inhalerPickup: {
    text: 'Pick up your inhaler from the pharmacy',
    measurement: {
      type: 'futureConfidence',
      frequency: 'weekly',
      period: 'week'
    },
    action: {
      phrase: 'pick up your inhaler',
      timing: generateOnceTiming()
    }
  },

}

var instructionBuckets = [
  ['antibioticPickup', 'antibiotics'],
  ['inhalerPickup', 'inhaler'],
  ['antibioticPickup', 'inhalerPickup', 'inhaler']
]

function generateOnceTiming() {
  return {
    type: 'once',
    timeframe: {
      from: moment(),
      to: moment().add(7, 'days')
    }
  }
}

export function generate(params) {
  params = params || {};
  params.quantity = params.quantity || 10;
  var users = [];
  for (var i = 0; i < params.quantity; i++) {
    var user = generateOneUser();
    users.push(user);
  }
  return users;
}


function generateOneUser() {
  var user = {
    identity: {
      firstName: selectOne(firstNames),
      lastName: selectOne(lastNames)
    },
    role: 'user',
    notifications: {
      nextContact: moment().subtract(10, 'days').toDate()
    },
  }
  user.identity.email = user.identity.firstName.slice(0,1).toLowerCase() + user.identity.lastName + '@test.com';
  user.password = 'test';
  user.instructions = generateInstructions();
  return user;
}

function selectOne(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateInstructions() {
  var instructions = [];
  var bucket = selectOne(instructionBuckets);
  for (var i = 0; i < bucket.length; i++) {
    var key = bucket[i];
    instructions.push(instructionIndex[key])
  }
  return instructions;
}
