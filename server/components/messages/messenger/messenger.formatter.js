'use strict';
import User from '../../../api/user/user.model';
var Messenger = require('./messenger.service');

export function toStandard(messageObj){
  return new Promise(function(resolve, reject){

    User.findOne({'messenger.id': messageObj.sender.id}, '_id').exec()
      .then(user => createUserIfNew(user))
      .then(format(messageObj, user))
      .then(message => resolve(message))
      .catch(err => {
        console.log(err);
        reject(err);
      })

      function createUserIfNew(user){
        return new Promise(function(reject, resolve){
          if(!user){
            Messenger.createMessengerUser(messageObj.sender.id)
            .then(resolve(user))
          } else {
            resolve(user);
          }
        })
      }

      function format(obj, user){
        return new Promise(function(resolve, reject){
          if(!user){
            reject('Need a user.')
          }
          var formatted = {
            userId: user._id,
            timestamp: obj.timestamp,
            from: 'user',
            interface: 'messenger'
          }

          if(messageObj.postback){
            formatted.data = obj.postback.payload;
          }

          if(messageObj.message){
            formatted.messenger = {};
            formatted.messenger.mid = obj.message.mid;
            formatted.messenger.seq = obj.message.seq;
            formatted.text = obj.message.text;
            formatted.attachments = obj.message.attachments
          }

          if(formatted.text){
            formatted.input = 'text'
          }

          if(formatted.data){
            formatted.input = 'button'
          }

          resolve(formatted);
        })
      }
  })
}

export function toMessenger(message){
  return new Promise(function(resolve, reject){
    console.log('formatting...')
    console.log(message)
    User.findById(message.userId, '_id messenger').exec()
      .then(user => {
        console.log(user)
        if(user.messenger && user.messenger.id){
          if(message.text && message.text.length > 0){
            var formatted = {
              recipient: {
                id: user.messenger.id
              },
              message: {
                text: message.text
              }
            }
            console.log('formatted: ')
            console.log(formatted);
            resolve(formatted);
          } else {
            reject('No message text included.')
          }
        } else {
          reject('No messenger account associated with this user id.')
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
