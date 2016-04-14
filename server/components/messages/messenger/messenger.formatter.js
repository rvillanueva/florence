'use strict';
import User from '../../../api/user/user.model';
var Messenger = require('./messenger.service');

export function toStandard(messageObj, user){
  return new Promise(function(resolve, reject){

    Messenger.createUserIfNeeded(messageObj.sender.id)
      .then(user => format(messageObj, user))
      .then(message => resolve(message))
      .catch(err => {
        console.log('Error:')
        console.log(err);
        reject(err);
      })

      function format(obj, user){
        return new Promise(function(resolve, reject){
          if(!user){
            reject('Need a user.')
          } else {
            var formatted = {
              userId: user._id,
              timestamp: obj.timestamp,
              from: 'user',
              interface: 'messenger'
            }

            if(obj.postback){
              formatted.data = obj.postback.payload;
            }

            if(obj.message){
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
          }
        })
      }
  })
}

export function toMessenger(message){
  return new Promise(function(resolve, reject){
    User.findById(message.userId, '_id messenger').exec()
      .then(user => {
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
        reject(err);
      })
  })
}
