/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Aspect from '../api/aspect/aspect.model';
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
        name: 'mood',
        imageUrl: 'https://i.imgur.com/FANqC05.jpg?1',
        type: 'outcome',
        callToAction: {
          title: 'Track your mood',
          subtitle: 'Log your mood patterns to understand what brings it up and down.'
        },
        scale: {
          min: 1,
          max: 10
        },
        questions: {
          score: ['On a scale of 1 to 10, how do you feel right now?', 'If you had to rank your mood between 1 (the worst) and 10 (the best), where would it be?'],
          trigger: ['What sort of things are making you feel better or worse?']
        }
      }, {
        key: 'anxiety',
        name: 'anxiety',
        imageUrl: 'https://i.imgur.com/FANqC05.jpg?1',
        type: 'outcome',
        scale: {
          min: 1,
          max: 10
        },
        callToAction: {
          title: 'Track your anxiety',
          subtitle: 'Log your anxiety to understand how to better manage it.'
        },
        questions: {
          score: ['On a scale of 1 to 10, how is your anxiety right now?'],
          trigger: ['What sort of things are making you more or less anxious?']
        }
      }, {
        key: 'medication',
        name: 'medication',
        imageUrl: 'https://i.imgur.com/OVko5.jpg',
        type: 'outcome',
        scale: {
          min: 0,
          max: 1
        },
        callToAction: {
          title: 'Set medication reminders',
          subtitle: 'Keeping your medication schedule can be confusing. I can help set reminders.'
        },
        questions: {
          score: ['Hey there! Did you take your medications?'],
          trigger: ['What sort of things are making you more or less anxious?']
        }
      })
      .then(() => {
        console.log('Aspects populated.');
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
      text: 'Hey there!',
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f882'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f882'),
      type: 'say',
      text: 'My name is River.',
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f883'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f883'),
      type: 'say',
      text: 'What\'s your name?',
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
      next: [{
        conditions: [],
        weight: 1,
        type: 'step',
        stepId: '5726c7b47721d48e5c52f884'
      }],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f886'),
      type: 'intent',
      intentId: '5726c7b47721d48e5c52f902',
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
      text: 'Great!',
      next: [],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f810'),
      type: 'say',
      text: 'Awesome saucseom!',
      next: [],
    }, {
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f889'),
      type: 'say',
      text: 'Uh oh, didn\'t understand!',
      next: [],
    }]
  }))
  .then(() => {
    console.log('Conversations populated.');
  });


Intent.find({}).remove()
  .then(() => Intent.create({
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f900'),
    match: 'hi\nhello\nhey',
    key: 'intro',
    global: true,
    conversationId: '5726c7b47721d48e5c52f876'
  }, {
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f901'),
    match: 'ryan\nbob\njon',
    key: 'name1'
  }, {
    _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f902'),
    match: 'amy',
    key: 'name2'
  }))
  .then(() => {
    console.log('Intents populated.');
  });
