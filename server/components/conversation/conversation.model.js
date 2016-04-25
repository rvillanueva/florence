'use strict';
var Promise = require("bluebird");
var Messages = require ('../messages');
var Context = require ('../context');
import User from '../../api/user/user.model';
var Entry = require('../entry');
var Paths = require('./paths');

export function constructor(response) {
  this.userId = response.userId;
  this.response = {
    intent: response.intent,
    message: response.message,
    entities: response.entities,
    choice: response.choice
  }
  this.intent = response.intent;
  this.entities = response.entities || {};
  this.user = function(){
    return User.findById(this.userId, '-salt -password')
  }

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

  return this;
}
