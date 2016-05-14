'use strict';
var Promise = require("bluebird");
var Messages = require('../services/messages');
import User from '../api/user/user.model';
var Entry = require('../services/entry');
var State = require('./bot.state');
var Conversation = require('../api/conversation/conversation.service');

export function constructor(message) {
  this.userId = message.userId;
  this.message = message;
  this.state = {
    status: '',
    checkup: {
      active: true
    },
    step: {
      id: '',
      intents: [],
      diverted: []
    },
    received: {
      intent: null,
      entities: {},
    },
    variables: {}
  }
  this.loaded = {
    conversation: false,
    step: false
  }
  this.cache = {};

  // RESPONSES

  this.say = function(text) {
    return Messages.send({
      userId: this.userId,
      text: text
    })
  }

  this.send = function(messages) {
    return new Promise((resolve, reject) => {
      messages.forEach((message, m) => {
        message.userId = this.userId;
        Messages.send(message);
      })
      resolve(true);
    })
  }

  this.confused = function(){
    var helpPhrases = [
      'Uh oh, not sure I understood that one. One more time?',
      'Sorry, I\'m still learning... can you try again?',
      'Hey, didn\'t catch that one. Can you try rephrasing?',
      'Oof, sorry – I didn\'t understand that. Say \'help\' if you\'d like to know what I can do.'
    ]
    var phrase = helpPhrases[Math.floor(Math.random()*helpPhrases.length)]
    return this.say(phrase) // TODO Handle confusion better
  }

  this.entry = function(entry){
    entry.userId = this.userId;
    return Entry.add(entry)
  }

  // STATE MANAGEMENT

  this.getState = function() {
    return new Promise((resolve, reject) => {
      State.get(this.userId)
        .then(state => {
          this.state = state;
          resolve(this)
        })
        .catch(err => reject(err))
    })
  }

  this.updateState = function() {
    return new Promise((resolve, reject) => {
      State.set(this.userId, this.state)
        .then(state => {
          this.state = state;
          this.state.receiving = this.state.receiving || {};
          this.state.variables = this.state.variables || {};

          resolve(this);
        })
        .catch(err => reject(err))
    })
  }

  // USER MANAGEMENT

  this.getUser = function(){
    return new Promise((resolve, reject) => {
      User.findById(this.userId, '-salt -password').exec()
      .then(user => {
        resolve(user)
      })
      .catch(err => reject(err))
    })
  }


  // STEP MANAGEMENT

  this.getStep = function() {
    return new Promise((resolve, reject) => {
      if (this.state.step.id) {
        Conversation.getByStepId(this.state.step.id, this.loaded.conversation)
          .then(convo => {
            this.loaded.conversation = convo;
            return Conversation.getStep(this.state.step.id, this.loaded.conversation)
          })
          .then(step => {
            this.loaded.step = step;
            console.log('Step set to ' + this.loaded.step._id);
            resolve(this)
          })
          .catch(err => reject(err))
      } else {
        resolve(this);
      }
    })
  }

  this.setStep = function(stepId) {
    return new Promise((resolve, reject) => {
      console.log('Setting step to ' + stepId);
      this.state.step.id = stepId;
      this.getStep()
        .then(() => resolve(this))
        .catch(err => reject(err))
    })
  }

  this.divert = function(convo){
    return new Promise((resolve, reject) => {
      this.loaded.conversation = convo;
      console.log(convo);
      this.state.step.diverted = this.state.step.diverted || [];

      // Get conversation
      if (this.state.step.id) {
        this.state.step.diverted.push({
          stepId: this.state.step.id
        });
        this.state.step.id = null;
      }
      // Set active step to first conversation step
      console.log('Setting active step to the first conversation step...');
      this.setStep(this.loaded.conversation.next[0].refId || this.loaded.conversation.steps[0]._id)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    })
  }

  this.revert = function(){
    return new Promise((resolve, reject) => {
      this.state.step.diverted = this.state.step.diverted || [];
      if(!this.state.step.id && this.state.diverted.length > 0){
        this.setStep(this.state.diverted[0].stepId)
        .then(() => {
          this.state.diverted.splice(0,1);
          resolve(this);
        })
      }
    })
  }

  this.init = function(){
    return new Promise((resolve, reject) => {
      this.getState()
        .then(()=> this.getStep())
        .then(() => resolve(this))
        .catch(err => reject(err))
    })
  }

  return this;
}


/*


  this.choices = function(text, choices){
    var buttons = [];
    choices.forEach(function(choice, c){
      var newButton = {
        type: 'postback',
        title: choice.title,
        payload: {
          intent: choice.intent,
          choice: choice.choice
        }
      }
      buttons.push(newButton);
    })
    return this.buttons(text, buttons);
  }

  this.buttons = function(text, buttons){
    return Messages.send({
      userId: this.userId,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: text,
          buttons: buttons
        }
      }
    })
  }

  this.cards = function(cards){
    return Messages.send({
      userId: this.userId,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: cards
        }
      }
    })
  }

*/
