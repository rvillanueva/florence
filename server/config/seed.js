/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Task from '../components/dialog-manager/task/task.model';

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
    Task.create(
      {
        objective: 'greet',
        type: 'say',
        say: 'Hi!',
        actions: [
          {
            type: 'chooseGreetingFollowup'
          }
        ]
      },{
      objective: 'introduceSelf',
      type: 'say',
      say: 'My name is Clara. I\'m a robot (though sometimes I get help from humans). I\'m happy to help you achieve your health goals by occasionally checking in to see if you\'ve run into any problems.',
      actions: [
        {
          type: 'introduceSelf'
        }
      ]
    },
    {
      objective: 'processNewGoals',
      type: 'say',
      say: 'It looks like you sent me a health plan. I\'ll processing these and I\'ll get back to you soon!'
    },
    {
      objective: 'transitionToAboutYou',
      type: 'say',
      say: 'In the meantime, I was hoping learn a bit about you. (It helps me make sure I\'m staying relevant :) )',
    },
    {
      objective: 'askForNewGoals',
      type: 'ask',
      say: 'Is there anything you\'d like to be doing to improve your health? I\'m happy to give ideas. If you were referred to me by a care provider, you can enter their health plan here.',
    },
    {
      objective: 'askForAdditionalNewGoals',
      aliasOf: 'askForNewGoals',
      type: 'ask',
      say: 'Any other goals?'
    },
    {
      objective: 'giveGoalIdeas',
      type: 'say',
      say: 'You might want to track your mood – that helps a lot of people see what makes them feel better or worse. I can also check in to see if you\'re taking your medications. Or maybe you want something fitness related, like exercising daily. It\'s okay if you don\'t know right now too. I can just chat to get to know you as well.',
    },
    {
      objective: 'respondTo_askForNewGoals_none',
      type: 'respond',
      say: 'No problem! In that case, I\'d love to learn a little bit about you. (And who knows, we might discover some good goals in the process :) ) First order of business:',
    },
    {
      objective: 'askForGivenName',
      type: 'ask',
      say: 'What should I call you?'
    },
    {
      objective: 'askForGivenName_response_name',
      type: 'respond',
      say: 'Great to meet you, [[user.givenName]]',
      actions: [
        {
          type: 'forceNextTask',
          params: {
            objective: 'askForInterests'
          }
        }
      ]
    },
    {
      objective: 'askForGivenName_response_reject',
      type: 'respond',
      say: 'Well, I do need to call you by name. But you can make something up if you\'d like.',
      actions: [
        {
          type: 'forceNextTask',
          params: {
            objective: 'askForGivenName'
          }
        }
      ]
    },

    {
      objective: 'askForInterests',
      type: 'ask',
      say: 'What sort of things do you enjoy doing?'
    },
    {
      objective: 'askForInterests_response_interest',
      type: 'respond',
      params: {
        interest: 'reading'
      },
      say: 'Sounds like a lot of fun — I’m working on reading too :)',
      actions: [
        {
          type: 'forceNextTask',
          params: {
            objective: 'askForConcerns'
          }
        }
      ]
    },
    {
      objective: 'askForConcerns',
      type: 'ask',
      say: 'So, it looks like you have a solid health plan in place. What sort of challenges do you think might come up?'
    },
    {
      objective: 'askForConcerns_response_none',
      type: 'respond',
      say: 'Good to hear! It sounds like you’re someone who’s pretty committed to their health. That’s a good thing. In my experience, those types of people are the ones who are the quickest to bring up challenges they face and work through them with their care provider.'
    },
    {
      objective: 'endIntro',
      type: 'respond',
      say: 'Anyways, that\'s it for now! I\'ll be checking in with you soon to see how you’re doing. Until then, have fun and let me know if you have any questions.'
    },
    {
      objective: 'askToHelp',
      type: 'ask',
      say: 'Let me know if there\'s anything I can help you with.'
    })
  })
