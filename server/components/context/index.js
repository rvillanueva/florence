'use strict';
var Promise = require('bluebird');
import User from '../../api/user/user.model';

function extractContext(user){
  return new Promise(function(resolve, reject){
    var context = user.context;
     if(user.timezone){
       context.timezone = user.timezone;
     }
     resolve(context);
   })
}

export function get(res){
 // figure out the last query to user and expected intent
 return new Promise(function(resolve, reject){
   User.findById(res.userId, '-salt -password').exec()
     .then(user => {
       if(!user){
         reject('No user found.')
       } else {
         extractContext(user)
         .then(context => {
           res.context = context;
           resolve(res);
         })
         .catch(err => reject(err))
       }
     })
     .catch(err => reject(err))
 })
}

export function set(userId, context){
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
   .then(user => {
     if(!user){
       reject('No user found.')
     } else {
       user.context = context;
       user.save()
       .then(user => resolve(user.context))
       .catch(err => reject(err))
     }
   })
 })
}

export function clear(userId){
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
   .then(user => {
     if(!user){
       reject('No user found.')
     } else {
       user.context = null;
       user.save()
       .then(user => resolve(user.context))
       .catch(err => reject(err))
     }
   })
 })
}
