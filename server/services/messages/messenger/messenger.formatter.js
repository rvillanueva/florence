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
              formatted.postback = obj.postback.payload;
            }

            if(obj.message){
              formatted.messenger = {};
              formatted.messenger.mid = obj.message.mid;
              formatted.messenger.seq = obj.message.seq;
              formatted.text = obj.message.text;
              formatted.attachments = obj.message.attachments;
            }

            if(formatted.text){
              formatted.input = 'text';
            }

            if(formatted.data){
              formatted.input = 'button';
            }

            resolve(formatted);
          }
        })
      }
  })
}

export function toMessenger(message) {
  return new Promise(function(resolve, reject) {
    var formatted = {
      recipient: {},
      message: {}
    };
    convertButtonsToMessenger(message)
      .then(message => User.findById(message.userId, '_id messenger').exec())
      .then(user => {
        if (!user) {
          reject('No user found with id: ' + message.userId)
        }
        if (user.messenger && user.messenger.id) {
          formatted.recipient.id = user.messenger.id;
        } else {
          reject('No user with that messenger id found.')
        }
        if (message.text) {
          formatted.message.text = message.text;
        }

        if (message.attachment) {
          formatted.message.attachment = message.attachment;
        }
        if (!formatted.message.text && !formatted.message.attachment) {
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

function convertButtonsToMessenger(message){
  return new Promise((resolve, reject) => {
    if(message.attachment && message.attachment.payload){
      if(message.attachment.payload.buttons){
        message.attachment.payload.buttons = convertButtons(message.attachment.payload.buttons);
      } else if (message.attachment.payload.elements) {
        var cards = message.attachment.payload.elements;
        cards.forEach((card, i) => {
          card.buttons = convertButtons(card.buttons);
        })
      } else {
        resolve(message)
      }
    }
    resolve(message)
  })
}

function convertButtons(buttons) {
  buttons.forEach((button, i) => {
    if(button.payload){
      button.payload = button.payload || {};
      var entities = '';
      var intent = button.payload.intent || '';
      var buttonValue = '';
      if (button.payload.buttonValue || button.payload.buttonValue === 0) {
        buttonValue = button.payload.buttonValue;
      }
      if (button.payload.entities) {
        console.log('BUTTON ENTITIES')
        console.log(button.payload.entities)
        entities = JSON.stringify(button.payload.entities);
      }
      var newPayload = 'BTN_' + intent + '_' + entities + '_' + buttonValue;
      button.payload = newPayload;
      console.log('BUTTON PAYLOAD: ' + newPayload)
    }
    console.log(button)
  })
  return buttons;
}
