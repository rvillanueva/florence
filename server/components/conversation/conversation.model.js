'use strict';
var Promise = require("bluebird");
var Paths = require('./paths');
var Messages = require ('../messages');
var Context = require ('../context');
import User from '../../api/user/user.model';
var Entry = require('../entry');

export function constructor(userId, message){
  this.userId = userId;
  this.message = message;
  return {
     message: this.message,
     user: () => {
         return User.findById(this.userId, '-salt -password')
     },
     say: (text) => {
        Messages.send({
          userId: this.userId,
          text: text
        })
     },
     sayOne: (phrases) => {
        console.log('Saying one of:');
        console.log(phrases);
        var index = Math.floor(Math.random() * phrases.length);
        var text = phrases[index];
        Messages.send({
           userId: this.userId,
           text: text
        });
     },
     context: ()=>{
         return Context.get(this.userId)
     },
     expect: (context) => {
       console.log('EXPECTING:');
       console.log(context);
         return Context.set(this.userId, context)
     },
     buttons: (text, buttons) => {
       console.log('SENDING BUTTONS:')
       console.log(text)
       console.log(buttons)
         return Messages.send({
           userId: this.userId,
           attachment:{
             type: 'template',
             payload: {
               template_type: 'button',
               text: text,
               buttons: buttons
             }
           }
         })
     },
     addEntry: (entry) => {
       entry.userId = this.userId;
       return Entry.add(entry)
     },
     next: () => {
       return new Promise(function(resolve, reject){
         resolve();
       })
       // choose next best option
     }
  }
}
