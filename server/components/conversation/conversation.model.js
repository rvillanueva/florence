'use strict';
var Promise = require("bluebird");
var Paths = require('./paths');
var Messages = require ('../messages');
import User from '../../api/user/user.model';

export function constructor(userId, message){
  this.userId = userId;
  this.message = message;
  return {
     message: this.message,
     user: () => {
       return new Promise(function(resolve, reject){
         User.findById(this.userId, '-salt -password')
         .then(user => resolve(user))
         .catch(err => reject(err))
       })
     },
     say: (text) => {
       return new Promise((resolve, reject) => {
         let message = {
           userId: this.userId,
           text: text
         }
         Messages.send(message)
         .then(res => resolve(res))
         .catch(err => reject(err))
       })
     },
     context: ()=>{
       return new Promise(function(resolve, reject){
         Context.getContext(this.userId)
         .then(context => resolve(context))
         .catch(err => reject(err))
       })
     },
     expect: (context) => {
       return new Promise(function(resolve, reject){
         Context.setContext(this.userId)
         .then(context => resolve(context))
         .catch(err => reject(err))
       })
     },
     next: () => {
       return new Promise(function(resolve, reject){
         resolve();
       })
       // choose next best option
     }
  }
}
