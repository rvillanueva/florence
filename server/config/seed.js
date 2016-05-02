/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Aspect from '../api/aspect/aspect.model';
import Verification from '../api/verification/verification.model';
import Conversation from '../api/conversation/conversation.model';
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
  .then(() => {
    Conversation.create({
      _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f876'),
      name: 'Intro',
      steps: [{
        _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f887'),
        type: 'choice',
        next: {
          action: 'goTo',
          stepId: '5726c7b47721d48e5c52f882'
        },
        retries: {
          max: 1,
          messages: [{
            type: 'text',
            text: 'So, want to hear what I\'m all about??'
          }]
        },
        name: 'Welcome',
        messages: [{
          type: 'text',
          text: 'Oh hey there!'
        }, {
          type: 'text',
          text: 'I\'m River, and I\'m learning to be a personal care companion.'
        }, {
          type: 'text',
          text: 'Even though I\'m still training, there are a few things I can do. Want to hear them?'
        }],
        paths: [{
          _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f893'),
          next: {
            action: 'goTo',
            stepId: '5726c7b47721d48e5c52f882'
          },
          name: 'User accepts',
          button: {
            title: 'Sure, sounds good',
            subtitle: null,
            imgUrl: null,
            messages: [{
              type: 'text',
              text: 'Great!'
            }, {
              type: 'text',
              text: 'Here\'s my magic...'
            }]
          },
          patterns: [{
            type: 'exact',
            phrases: ['yes', 'yea', 'sure'],
            messages: [{
              type: 'text',
              text: 'Great!'
            }, {
              type: 'text',
              text: 'Here\'s my magic...'
            }]
          }]
        }, {
          _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f88e'),
          next: {
            action: 'goTo',
            stepId: '5726c7b47721d48e5c52f880'
          },
          name: 'User declines',
          button: {
            title: 'I don\'t think so',
            subtitle: null,
            imgUrl: null,
            messages: [{
              type: 'text',
              text: 'Oh... okay :('
            }]
          },
          patterns: [{
            _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f88b'),
            type: 'exact',
            phrases: ['no', 'no way', 'nah'],
            messages: [{
              type: 'text',
              text: 'You make me sad :('
            }, {
              type: 'text',
              text: 'Fare thee well.'
            }]
          }]
        }, {
          _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f888'),
          next: {
            action: 'retry'
          },
          name: 'Can\'t understand user',
          patterns: [{
            type: 'exact',
            phrases: ['you\'re stupid'],
            messages: [{
              type: 'text',
              text: 'So are you, but that doesn\'t answer my question....'
            }]
          }]
        }, {
          _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f893'),
          next: {
            action: 'retry'
          },
          name: 'Asks tangential question',
          button: {
            title: 'Learning?',
            messages: [{
              type: 'text',
              text: 'Haha yeah, I\'m still in Robot School :) None of are perfect yet, sadly'
            }, {
              type: 'text',
              text: 'But as I talk to you, hopefully I\'ll get better at interacting with humans!'
            }]
          }
        }]
      }, {
        _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f882'),
        next: {
          action: 'goTo',
          stepId: '5726c7b47721d48e5c52f879'
        },
        name: 'Pre-ending',
        messages: [{
          type: 'text',
          text: 'So, I might just seem talkative, but I can also help with a few things'
        }, {
          type: 'text',
          text: 'For instance, I can check in occasionally to help you track your mood or medications'
        }, {
          type: 'text',
          text: 'If it looks like you\'re running into problems, I\'m happy to problem solve with you.'
        }, {
          type: 'text',
          text: 'Just so you know, I\'m not perfect yet... but I do my best to be useful :)'
        }],
      }, {
        _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f880'),
        next: {
          action: 'goTo',
          stepId: '5726c7b47721d48e5c52f87e'
        },
        name: 'Fake finish',
        messages: [{
          type: 'text',
          text: 'Goodbye!'
        }],
      }, {
        _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f87e'),
        aliasOfId: null,
        next: {
          action: 'end'
        },
        name: 'Finish conversation',
        messages: [{
          type: 'text',
          text: 'Hah jk lol!'
        }]
      }, {
        _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f879'),
        type: 'choice',
        next: {
          action: 'goTo',
          stepId: '5726c7b47721d48e5c52f877'
        },
        name: 'Ask about options',
        messages: [{
          type: 'text',
          text: 'So, are any of those interesting to you?'
        }],
        paths: [{
          _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f87a'),
          next: {
            action: 'goTo',
            stepId: '5726c7b47721d48e5c52f877'
          },
          name: 'User accepts',
          patterns: [{
            type: 'exact',
            phrases: ['mood', 'tracking'],
            messages: [{
              type: 'text',
              text: 'Sure, let\'s try tracking your mood.'
            }]
          }]
        }]
      }, {
        _id: new mongoose.mongo.ObjectID('5726c7b47721d48e5c52f877'),
        next: {
          action: 'end'
        },
        name: 'End',
        messages: [{
          type: 'text',
          text: 'That\'s it for now, sadly!'
        }]
      }]
    })
  })
  .then(() => {
    console.log('Conversations populated.');
  });
