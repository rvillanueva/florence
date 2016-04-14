'use strict';
import User from '../../../api/user/user.model';
var Messenger = require('./messenger.service');

export function toStandard(messageObj){
  return new Promise(function(resolve, reject){

    function doFormat(user){
      return new Promise(function(resolve, reject){
        console.log('Formatting with user:')
        console.log(JSON.stringify(user))
        var formatted = {
          userId: user._id,
          timestamp: messageObj.timestamp,
          from: 'user',
          interface: 'messenger'
        }

        if(messageObj.postback){
          formatted.data = messageObj.postback.payload;
        }

        if(messageObj.message){
          formatted.messenger = {};
          formatted.messenger.mid = formattedMsg.messenger.mid;
          formatted.messenger.seq = formattedMsg.messenger.seq;
          formatted.text = messageObj.message.text;
          formatted.attachments = messageObj.message.attachments
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
    User.findOne({'messenger.id': messageObj.sender.id}, '_id').exec()
      .then(user => {
        if(!user){
          Messenger.createMessengerUser(messageObj.sender.id)
          .then(user => doFormat(user))
          .then(message => resolve(message))
          .catch(err => console.log(JSON.stringify(err)))
        } else {
          doFormat(user)
          .then(message => resolve(message))
          .catch(err => console.log(JSON.stringify(err)))
        }

      })
      .catch(err => {
        reject(err);
      })
  })
}

export function toMessenger(message){
  return new Promise(function(resolve, reject){
    User.findById(message.userId, '-salt -password').exec()
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
      console.log(JSON.stringify(err))
    })
  })
}
