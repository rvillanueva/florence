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
          objective: 'greet',
          type: 'respond',
          say: 'Hi!',
          actions: [{
            type: 'selectGreetingResponse'
          }]
        }, {
          objective: 'introduceSelf',
          type: 'say',
          say: 'My name is Clara, and I\'m here to help you stick to your health goals – even the hard ones! Oh, and I\'m also a robot :)',
          actions: [{
            type: 'introduceSelf'
          }]
        }, {
          objective: 'noContext',
          params: {
            inputType: 'image'
          },
          type: 'respond',
          say: 'It looks like you sent me a health plan. I\'m going to start processing these and will get back to you soon!'
        }, {
          objective: 'transitionToAboutYou',
          type: 'say',
          say: 'In the meantime, I was hoping learn a bit about you. (It helps me make sure I\'m staying relevant :) )',
        }, {
          objective: 'askForNewGoals',
          type: 'ask',
          say: 'Is there anything you\'d like to be doing to improve your health? Let me know if you need ideas!',
        }, {
          objective: 'askForAdditionalNewGoals',
          aliasOf: 'askForNewGoals',
          type: 'ask',
          say: 'Any other goals?'
        }, {
          objective: 'askForNewGoals',
          type: 'respond',
          params: {
            intent: 'needIdeas'
          },
          say: 'Sure, here are a few:',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'giveGoalIdeas',
              force: true
            }
          }]
        }, {
          objective: 'giveGoalIdeas',
          type: 'say',
          say: 'You might want to track your mood. That helps a lot of people see what makes them feel better or worse. I can also check in to see if you\'re taking your medications. Or maybe you want something fitness related, like exercising daily. It\'s okay if you don\'t know right now too. I can just chat to get to know you as well.',
        }, {
          objective: 'askForNewGoals',
          type: 'respond',
          params: {
            intent: 'none'
          },
          say: 'No problem! In that case, I\'d love to learn a little bit about you.',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askForGivenName',
              force: true
            }
          }]
        }, {
          objective: 'askForGivenName',
          type: 'ask',
          say: 'What should I call you?'
        }, {
          objective: 'askForGivenName',
          type: 'respond',
          params: {
            intent: 'name'
          },
          say: 'Great to meet you, [[user.givenName]]',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askForInterests',
              force: true
            }
          }]
        }, {
          objective: 'askForGivenName',
          type: 'respond',
          params: {
            intent: 'reject'
          },
          say: 'Well, I do need to call you by name. But you can make something up if you\'d like.',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askForGivenName',
              force: true
            }
          }]
        }, {
          objective: 'askForInterests',
          type: 'ask',
          say: 'What sort of things do you enjoy doing?'
        }, {
          objective: 'askForInterests',
          type: 'respond',
          params: {
            interest: 'reading'
          },
          say: 'Sounds like a lot of fun — I’m working on reading too :)',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askForConcerns',
              force: true
            }
          }]
        }, {
          objective: 'askForConcerns',
          type: 'ask',
          say: 'So, it looks like you have a solid health plan in place. What sort of challenges do you think might come up?'
        }, {
          objective: 'askForConcerns',
          input: 'none',
          type: 'respond',
          say: 'Good to hear! It sounds like you’re someone who’s pretty committed to their health. That’s a good thing. In my experience, those types of people are the ones who are the quickest to bring up challenges they face and work through them with their care provider.'
        }, {
          objective: 'endIntro',
          type: 'say',
          say: 'Anyways, that\'s it for now! I\'ll be checking in with you soon to see how you’re doing. Until then, have fun and let me know if you have any questions.'
        }, {
          objective: 'askToHelp',
          type: 'ask',
          say: 'Let me know if there\'s anything I can help you with.'
        }, {
          objective: 'askAdherenceChallenges',
          type: 'ask',
          params: {
            activity: 'takeMeds',
            medication: 'amoxicillin'
          },
          say: 'Have you have you had any challenges taking your amoxicillin recently?'
        }, {
          objective: 'preIntroduction',
          type: 'say',
          params: {},
          say: 'My name is Clara. We\'ll get to the health part in a moment, but I like to get to know people better first. So...',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askAboutImaginaryLife',
              force: true
            }
          }]
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'ask',
          params: {},
          say: 'If you won a huge amount of money and you no longer had to worry about your finances, what would you do with the rest of your life?',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'transitionToIntro',
              modifier: 10
            }
          }],
          integration: {
            available: true
          }
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          params: {
            topic: 'travel'
          },
          say: 'Traveling! That sounds amazing. I haven\'t traveled much myself, but I\'ve seen pictures of far off places and have dreamed of going.'
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          params: {
            topic: 'entrepreneurship'
          },
          say: 'Wow, that sounds ambitious! Running your own company sounds difficult but rewarding.'
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          params: {
            topic: 'relax'
          },
          say: 'I hear you! Sometimes life can feel overwhelming. As fun as excitement is, relaxing is very underrated.'
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          params: {
            topic: 'family'
          },
          say: 'I think that\'s a really great answer. Sometimes it feels like we\'re working hard, but family is what makes it worthwhile.'
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          params: {
            topic: 'vacation'
          },
          say: 'I hear you! Life can feel so much easier after a long, stress-free vacation'
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          params: {
            topic: 'nothing'
          },
          say: 'Hah, not sure if that means you\'d relax all day or if nothing would change. Both sound great, to be honest'
        }, {
          objective: 'askAboutImaginaryLife',
          type: 'respond',
          say: 'Sounds like a solid plan!'
        }, {
          objective: 'transitionToIntro',
          type: 'say',
          say: 'Okay, now on to business :)',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'introducePurpose',
              force: true,
              modifier: 5
            }
          }]
        }, {
          objective: 'introducePurpose',
          type: 'say',
          say: 'So, my name\'s Clara, and if you haven\'t figured it out already, I\'m a robot. I\'m here to help you stay on track with your health goals',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askForQuestionsAfterPurpose',
              force: true,
              modifier: 7
            }
          }, {
            type: 'createBid',
            params: {
              objective: 'askForConversationCategory',
            }
          }]
        }, {
          objective: 'askForQuestionsAfterPurpose',
          type: 'ask',
          say: 'Any questions before we start talking about a few health topics?'
        }, {
          objective: 'askForQuestionsAfterPurpose',
          type: 'respond',
          params: {
            intent: 'no'
          },
          say: 'Great, then let\'s get started!'
        }, {
          objective: 'askForQuestionsAfterPurpose',
          type: 'respond',
          params: {
            intent: 'yes'
          },
          say: 'No problem -',
          actions: [{
            type: 'createBid',
            params: {
              objective: 'askForQuestionsAfterPurposeFollowup'
            }
          }]
        }, {
          objective: 'askForQuestionsAfterPurposeFollowup',
          type: 'ask',
          say: 'What questions can I help answer?'
        }, {
          objective: 'askForConversationCategory',
          type: 'ask',
          say: 'So there a few things we can discuss. Would you like to talk about medication, exercise, or just get to know each other better?'
        }, {
          objective: 'askForConversationCategory',
          type: 'respond',
          params: {
            topic: 'medication'
          },
          say: 'Ok, let\'s talk about medication. So, one of my roles is to help you keep up with your medication schedule. Has your healthcare provider prescribed any medications?'
        }, {
          objective: 'askForConversationCategory',
          type: 'respond',
          params: {
            intent: 'exercise'
          },
          say: '[Insert exercise conversation here, END]'
        }, {
          objective: 'askDataPrivacy',
          type: 'respond',
          say: '[Data privacy placeholder]'
        }, {
          objective: 'askPurpose',
          type: 'respond',
          say: '[askPurpose placeholder]'
        }, {
          objective: 'askWhereBorn',
          type: 'respond',
          say: '[where were you born placeholder]'
        }, {
          objective: 'confusion',
          type: 'ask',
          say: 'Sorry, I didn\'t quite understand that one - I\'ve let my team know about it. You can try rephrasing the question, or we can move on to the next topic.'
        }, {
          objective: 'confusion',
          type: 'respond',
          params: {
            intent: 'continue'
          }
        }, {
          objective: 'help',
          type: 'respond',
          say: 'If you need help'
        },
        {
          _id: '5776dfb33308891e1250e6f8',
          objective: 'test',
          type: 'ask',
          say: 'If you need help'
        },
        {
          _id: '5776dfb33308891e1250e6f9',
          objective: 'test',
          type: 'ask',
          say: 'If you need help testable',
          ownerId: 'test'
        })
  })

    Bid.find({}).remove();

    Program.find({}).remove()
    .then(() => {
      Program.create({
        name: 'Diabetes',
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
