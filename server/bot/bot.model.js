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
  this.conversation;
  this.step;
  this.ref;

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


  // STEP MANAGEMENT


  this.getStep = function(){
    return new Promise((resolve, reject) => {
      if(this.state.step.id){
        Conversation.getByStepId(this.state.step.id, this.conversation)
        .then(convo => {
          this.conversation = convo;
          return Conversation.getStep(this.state.step.id, this.conversation)
        })
        .then(step => {
          this.step = step;
          console.log('Step set to ' + this.step._id);
          resolve(this)
        })
        .catch(err => reject(err))
      } else {
        resolve(false);
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

  this.divert = function(conversationId) {
    return new Promise((resolve, reject) => {
      console.log('Diverting...')
      this.state.step.diverted = this.state.step.diverted || [];
      // Get conversation
      this.getConversation(conversationId)
      .then(() => {
        console.log('Conversation retrieved...')
        if (this.state.step.id) {
          this.state.step.diverted.push({
            stepId: this.state.step.id
          });
          this.state.step.id = null;
        }
        // Set active step to first conversation step
        console.log('Setting active step to the first conversation step...')
        this.setStep(this.conversation.next[0].refId || this.conversation.steps[0]._id)
          .then(() => resolve(this))
          .catch(err => reject(err))
      })
    })
  }

  this.getConversation = function(conversationId){
    return new Promise((resolve, reject) => {
      if(this.conversation && this.conversation._id == conversationId){
        resolve(this);
      } else {
        Conversation.getById(conversationId)
        .then(convo => {
            this.conversation = convo;
            resolve(this);
        })
        .catch(err => reject(err))
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


  this.say = function(text){
    return Messages.send({
      userId: this.userId,
      text: text
    })
  }

  this.sayOne = function(phrases){
    console.log('Saying one of:');
    console.log(phrases);
    var index = Math.floor(Math.random() * phrases.length);
    var text = phrases[index];
    return Messages.send({
      userId: this.userId,
      text: text
    });
  }

  this.start = function(intent){
    if(!intent){
      console.log('No intent to start...')  // FIXME should this be handled with default intent?
    }
    this.intent = intent;
    this.entities = {};
    Paths.start(this.intent, this);
  }

  this.respond = function(intent){
    this.intent = intent || this.intent;
    Paths.respond(this.intent, this);
  }

  this.wait = function(intent, needed, entities){
    this.intent = intent || this.intent;
    return Context.set(this.userId, {
      intent: this.intent,
      needed: needed,
      entities: entities
    })
  }

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

  this.entry = function(entry){
    entry.userId = this.userId;
    return Entry.add(entry)
  }

  this.choose = function(branches, map){
    if(!this.response.choice && map){
      map.forEach(function(option, o){
        if(this.entities[option.entity] == option.value){
          return choices[option.choice];
        }
      })
      return false;
    } else if (!branches[this.response.choice]){
      console.log('No branch found for ' + response.choice)
      return false;
    }
    return choices[this.response.choice];
  }

  this.next = function(){
    return new Promise((resolve, reject) => {
        Context.clear(this.userId);
        // get next best action;
        resolve();
      })
      // choose next best option
  }

*/
