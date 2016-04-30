'use strict';
var Promise = require('bluebird');
import User from '../api/user/user.model';

export function get(userId){
 // figure out the last query to user and expected intent
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
     .then(user => {
       if(!user){
         reject('No user found.')
       } else {
          resolve(user.state);
       }
     })
     .catch(err => reject(err))
 })
}

export function set(userId, state){
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
   .then(user => {
     if(!user){
       reject('No user found.')
     } else {
       user.state = state;
       user.save()
       .then(user => resolve(user.state))
       .catch(err => reject(err))
     }
   })
 })
}
