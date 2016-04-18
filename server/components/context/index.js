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

export function get(userId){
 // figure out the last query to user and expected intent
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
     .then(user => extractContext(user))
     .then(context => resolve(context))
     .catch(err => reject(err))
 })
}

export function set(userId, context){
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
   .then(user => {
     user.context = context;
     user.save()
     .then(user => resolve(user.context))
     .catch(err => reject(err))
   })
 })
}

export function clear(userId){
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
   .then(user => {
     user.context = null;
     user.save()
     .then(user => resolve(user.context))
     .catch(err => reject(err))
   })
 })
}
