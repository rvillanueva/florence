'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');
var Paths = require('../../paths');

Paths.add('hello', function(conversation, response) {
  this.respond = function() {
    conversation.start('startOnboard')
  }
  this.start = function() {

  }
  return this;
})

Paths.add('subscribe', function(conversation, response) {
  this.start = function() {

  }
  this.respond = function() {

  }
  return this;
})

Paths.add('startOnboard', function(conversation) {
  this.start = function() {
    conversation.say('Oh, hey there!');
    conversation.say('I\'m River, and I\'m learning to be a personal care companion.');
    conversation.choices(' ', [{
      title: 'What can you do?',
      choice: 'skills'
    }, {
      title: 'Learning?',
      choice: 'learning'
    }])
    return conversation.wait();
  }


  this.branches = {
    skills: () => {
      conversation.start('trackAspect');
    },
    learning: () => {
      conversation.say('Yup! I\'m still in the Bot Academy, so I haven\'t been certified to do everything quite yet. :)');
      conversation.say('But interacting with you will teach me some new things about how to talk to people.');
      conversation.start('explainSkills');
    }
  }
  this.respond = conversation.choose(this.branches);

})

Paths.add('explainSkills', function(conversation) {
  this.start = function() {
    conversation.say('Even though I\'m still training, there are a few things I can do. Want to hear them?');
    conversation.choices(' ', [
      {
        title: 'Sure',
        choice: 'yes'
      },
      {
        title: 'Nope.',
        choice: 'no'
      }
    ])
    return conversation.wait();
  }

  this.branches = {
    yes: () => {
      conversation.say('Great!');
      conversation.start('trackAspect');
    },
    no: () => {
      conversation.say('Okay, no problem! If there\'s anything you want me to help you track, feel free to type it in below!')
    }
  }

  this.respond = conversation.choose(this.branches);

  return this;
})
