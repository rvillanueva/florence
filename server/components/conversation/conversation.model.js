'use strict';
var Promise = require("bluebird");
var Paths = require('./paths');
var Messages = require ('../messages');
var Context = require ('../context');
import User from '../../api/user/user.model';

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
         let text = phrases[Math.floor(Math.rand() * phrases.length)].text;
         return Messages.send({
           userId: this.userId,
           text: text
         });
     },
     context: ()=>{
         return Context.get(this.userId)
     },
     expect: (context) => {
         return Context.set(this.userId, context)
     },
     next: () => {
       return new Promise(function(resolve, reject){
         resolve();
       })
       // choose next best option
     }
  }
}
