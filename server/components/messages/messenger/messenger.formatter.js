'use strict';
import User from '../../../api/user/user.model';
var Messenger = require('./messenger.service');
var UserService = require('../../user');

export function toStandard(messageObj, user){
  return new Promise(function(resolve, reject){

    UserService.getUserByMessengerId(messageObj.sender.id)
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
    var formatted = {
      recipient: {},
      message: {}
    };
    User.findById(message.userId, '_id messenger').exec()
      .then(user => {
        if(!user){
          reject('No user found.')
        }
        if(user.messenger && user.messenger.id){
          formatted.recipient.id = user.messenger.id;
        } else {
          reject('No user with that messenger id found.')
        }
        if(message.text){
          formatted.message.text = message.text;
        }

        if(message.attachment){
          formatted.message.attachment = message.attachment;
        }
        if(!formatted.message.text && !formatted.message.attachment){
          reject('Message contained no content.');
        }
        resolve(formatted);
      })
      .catch(err => {
        console.log(err)
        reject(err);
      })
  })
}
