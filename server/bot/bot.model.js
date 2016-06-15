'use strict';
var Promise = require("bluebird");
var Messages = require('../services/messages');
import User from '../api/user/user.model';
var Entry = require('../services/entry');
var State = require('./bot.state');
var Conversation = require('../api/conversation/conversation.service');

export function constructor(userId) {
  this.userId = userId;
  this.message;
  this.state = {
    status: '',
    checkin: {
      active: true
    },
    current: {
      type: null,
      stepId: null
    },
    queued: [],
    received: {
      intent: null,
      features: {},
    },
    variables: {}
  }
  this.loaded = {
    conversation: false,
    step: false,
    type: false,
    next: {
      type: null, // step, checkin,
      stepId: null
    }
  }
  this.cache = {};

  // RESPONSES

  this.say = function(text) {
    return new Promise((resolve, reject) => {
      Messages.send({
        userId: this.userId,
        text: text
      })
      .then(() => resolve(this))
      .catch(err => reject(err))
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
      this.state.current = this.state.current || {};
      console.log('Getting step...')
      console.log(this.state.current);
      // TODO fix when it's not a step type
      if (this.state.current.type == 'step') {
        Conversation.getByStepId(this.state.current.stepId, this.loaded.conversation)
          .then(convo => {
            this.loaded.conversation = convo;
            return Conversation.getStep(this.state.current.stepId, this.loaded.conversation)
          })
          .then(step => {
            this.loaded.step = step;
            console.log('Step ' + this.loaded.step._id + ' loaded');
            resolve(this)
          })
          .catch(err => reject(err))
      } else if (this.state.current.type == 'checkin'){
        console.log('Setting status to checkin...')
        this.state.status = 'checkin';
        resolve(this);
      } else if(!this.state.current.type){
        resolve(this);
      } else {
        reject(new TypeError('Unrecognized current step type.'));
      }
    })
  }

  this.set = function(loadable) {
    return new Promise((resolve, reject) => {
      console.log('Setting to ' + loadable.type);
      this.state.current = loadable;
      this.state.current.updated = new Date();
      this.getStep()
        .then(() => resolve(this))
        .catch(err => reject(err))
    })
  }

  this.divert = function(loadable){
    return new Promise((resolve, reject) => {
      console.log('Diverting to ' + loadable.type);
      this.state.queued = this.state.queued || [];
      if (this.state.current) {
        this.state.queued.push(this.state.current);
        this.state.current = {};
      }
      this.set(loadable)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    })
  }

  this.queueNext = function(loadable){
    return new Promise((resolve, reject) => {
      this.state.queued = this.state.queued || [];
      this.state.queued.push(loadable);
      resolve(this);
    })
  }

  this.queueNext = function(loadable){
    return new Promise((resolve, reject) => {
      this.state.queued = this.state.queued || [];
      this.state.queued.push(loadable);
      resolve(this);
    })
  }

  this.next = function(){
    return new Promise((resolve, reject) => {
      this.state.queued = this.state.queued || [];
      if(this.state.current){
        reject('Can\'t proceed to next in queue with active step.')
      } else if(this.state.queued.length > 0){
        this.set(this.state.queued[0])
        .then(() => {
          this.state.queued.splice(0,1);
          resolve(this);
        })
      } else {
        console.log('Nothing left in queue.')
        bot.state.status = 'done';
        resolve(this)
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
