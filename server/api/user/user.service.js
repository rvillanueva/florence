'use strict';
var Promise = require('bluebird');
import User from '../../api/user/user.model';
var request = require('request');

export function getUserByMessengerId(messengerId) {
  return new Promise(function(resolve, reject) {
    User.findOne({
        'messenger.id': messengerId
      }, '_id').exec()
      .then(user => {
        if (user) {
          resolve(user);
        } else {
          var userData = {
            messenger: {
              id: messengerId
            },
          }
          var newUser = new User(userData);
          newUser.provider = 'messenger';
          newUser.role = 'user';
          newUser.state = {
            conversation: {},
            received: {
              intent: 'intro'
            },
            variables: {}
          }
          updateFbProfile(newUser)
          .then(user => resolve(user))
          .catch(err => {
            newUser.save()
            .then(user => resolve(user))
            .catch(reject(err))
          })
        }
      })
      .catch(err => reject(err))
  })

}

export function updateFbProfile(user) {
  return new Promise(function(resolve, reject) {
    if(!user || !user.messenger || !user.messenger.id){
      reject('Need user with messenger id.')
    }
    var options = {
      url: 'https://graph.facebook.com/v2.6/' + user.messenger.id,
      qs: {
        fields: 'first_name,last_name,profile_pic',
        access_token: process.env.FB_PAGE_TOKEN
      }
    }
    request.get(options, function(err, response, body) {
      if(err){
        reject(err);
      }
      var fbProfile = JSON.parse(body);
      if(fbProfile.first_name){
        user.firstName = fbProfile.first_name;
      }
      if(fbProfile.last_name){
        user.lastName = fbProfile.last_name;
      }
      if(fbProfile.profile_pic){
        user.picture = fbProfile.profile_pic;
      }
      user.save()
      .then(user => resolve(user))
      .catch(err => reject(err))
    })
  })
}
