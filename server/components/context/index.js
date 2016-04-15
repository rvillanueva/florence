'use strict';

/* context block: context: {
  intent: 'test',
  entities: {
    have: {
      measure: "mood"
    },
    need: []
  }
}
*/

var Promise = require('bluebird');
import User from '../../api/user/user.model';

export function get(userId){
 // figure out the last query to user and expected intent
 return new Promise(function(resolve, reject){
   User.findById(userId, '-salt -password').exec()
     .then(user => {
       var context = user.context;
       if(user.timezone){
         context.timezone = user.timezone;
       }
       resolve(context)
     })
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
