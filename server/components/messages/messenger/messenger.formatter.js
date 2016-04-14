'use strict';
import User from '../../../api/user/user.model';
var Messenger = require('./messenger.service');

export function toStandard(messageObj){
  return new Promise(function(resolve, reject){

    function doFormat(user){
      return new Promise(function(resolve, reject){
        if(!user){
          reject('Need a user.')
        }
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
          formatted.messenger.mid = messageObj.message.mid;
          formatted.messenger.seq = messageObj.message.seq;
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
          .catch(err => {
            console.log(err)
          })
        } else {
          doFormat(user)
          .then(message => resolve(message))
          .catch(err => {
            console.log(err)
          })
        }

      })
      .catch(err => {
        reject(err);
      })
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
