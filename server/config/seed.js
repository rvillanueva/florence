/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Aspect from '../api/aspect/aspect.model';
import Metric from '../api/metric/metric.model';
import Verification from '../api/verification/verification.model';
import Conversation from '../api/conversation/conversation.model';
import Intent from '../api/intent/intent.model';
import mongoose from 'mongoose';

Verification.find({}).remove();
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
        name: 'Mood',
        type: 'symptom',
      }, {
        key: 'anxiety',
        name: 'Anxiety',
        type: 'symptom',
      }, {
        key: 'takeMeds',
        name: 'Medication Adherence',
        type: 'behavior',
      })
      .then(() => {
        console.log('Aspects populated.');
      });
  });

Metric.find({}).remove()
  .then(() => {
    Metric.create({
      aspect: 'mood',
      metric: 'level',
      name: 'Mood level',
      public: true,
      timespan: 'point',
      question: 'How would you rate your mood right now on a scale of 1 to 10? (With 1 being the worst and 10 being the best.)',
      priority: 1,
      validation: {
        type: 'number',
        min: 1,
        max: 10
      }
    },
    {
      aspect: 'mood',
      metric: 'triggersNegative',
      timespan: 'point',
      public: true,
      question: 'What \'s making your mood worse?',
      priority: 4,
      validation: {
        type: 'text',
        analyzed: [{
            entity: 'behaviors'
        }]
      }
    },
    {
      aspect: 'mood',
      metric: 'triggersPositive',
      timespan: 'point',
      public: true,
      question: 'What\'s making your mood better?',
      priority: 5,
      validation: {
        type: 'text',
        analyzed: [{
            entity: 'behaviors'
        }]
      }
  })
    .then(() => {
      console.log('Metrics populated.');
    });
  });

Conversation.find({}).remove()
  .then(() => Conversation.create({
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f876'),
    name: 'Intro',
    tags: [],
    intent: 'intro',
    next: [{
      conditions: [],
      weight: 1,
      stepId: '5726c7b47721d48e5c52f887'
    }],
    steps: [{
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f887'),
      type: 'say',
      text: 'Hey there! My name is River.',
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f723'
      }],
    },{
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f723'),
      type: 'say',
      text: 'I\'m learning to be a personal care companion.',
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f883'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f883'),
      type: 'say',
      text: 'Right now, most people use me to track their mood. Is that something you\'re interested in?',
      next: [{
        conditions: [],
        weight: 1,
        stepId: '5726c7b47721d48e5c52f885'
      }, {
        conditions: [],
        weight: 1,
        stepId: '5726c7b47721d48e5c52f886'
      }, {
        conditions: [],
        weight: 1,
        stepId: '5726c7b47721d48e5c52f666'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f885'),
      type: 'intent',
      intentId: '5726c7b47721d48e5c52f901',
      actions: [{
        type: 'addTrack',
        params: {
          aspect: 'mood',
          metric: 'level',
          priority: 1
        }
      },
      {
        type: 'addTrack',
        params: {
          aspect: 'mood',
          metric: 'triggersPositive',
          priority: 4
        }
      },
      {
        type: 'addTrack',
        params: {
          aspect: 'mood',
          metric: 'triggersNegative',
          priority: 5
        }
      }],
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f884'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f886'),
      type: 'intent',
      intentId: '5726c7b47721d48e5c52f801',
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f810'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f666'),
      type: 'fallback',
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f889'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f884'),
      type: 'say',
      actions:[
        {
          type: 'queueCheckin'
        }
      ],
      text: 'Great! Let\'s get started.',
      next: [],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f810'),
      type: 'say',
      text: 'Okay, let\'s track your meds...',
      next: [],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f889'),
      type: 'say',
      text: 'Uh oh, didn\'t understand!',
      next: [],
    },
    {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f987'),
      type: 'end',
      action: 'checkin',
      next: [],
    }]
  }))
  .then(() => {
    console.log('Conversations populated.');
  });


Intent.find({}).remove()
  .then(() => Intent.create({
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f900'),
    name: 'Greeting',
    match: 'hi\nhello\nhey',
    key: 'hello',
    global: true,
    conversationId: '5726c7b47721d48e5c52f876'
  }, {
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f919'),
    name: 'Help',
    match: 'help\nwhat do you do?\n',
    global: true,
    key: 'help'
  },{
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f901'),
    name: 'Yes',
    match: 'yes\nyeah\nsure',
    key: 'yes'
  },{
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f100'),
    name: 'No',
    match: 'no\nnope\nnaw\nnot right now',
    key: 'no'
  }, {
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f910'),
    name: 'Number',
    match: '',
    key: 'number'
  },
  {
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f801'),
    name: 'Add Tracking',
    match: 'help me track my meds\ntrack medications\ntrack',
    key: 'addTrack',
    global: true
  },
  {
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f912'),
    name: 'Vaccine Danger',
    match: 'vaccines are dangerous',
    key: 'belief',
    entities: [{
      key: 'belief_vaccine_danger',
      value: 'high'
    }]
  }
))
  .then(() => {
    console.log('Intents populated.');
  });
