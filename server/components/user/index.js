'use strict';

var Promise = require('bluebird');

export function get(ids){
  return new Promise(function(resolve, reject){
    var query;
    if(ids.mobile){
      query = {
        mobile: ids.mobile
      }
      returnUser();
    } else {
      reject(new Error('No valid identifier provided.'))
    }

    function returnUser(){
      User.find(query)
      .then(user => resolve(user))
      .catch(err => reject(err))
    }

  })
}

export function getOrCreate(ids){
  return new Promise(function(resolve, reject){
    get(ids)
    .then(user => handleNoUser(user))
    .then(user => resolve(user))
    .catch(err => reject(err))
    
    function handleNoUser(user){
      return new Promise(function(resolve, reject){
        if(!user){
          createUser(ids)
          .then(user => resolve(user))
          .catch(err => reject(err))
        } else {
          resolve(user)
        }
      })
    }

  })


  function createUser(ids){
    return new Promise(function(resolve, reject){
      if(ids.mobile){
        User.create({
          provider: 'mobile',
          mobile: ids.mobile
        })
        .then(user => resolve(user))
        .catch(err => reject(err))
      } else {
        reject(new Error('Insufficient identification provided to create user.'))
      }
    })
  }

}
