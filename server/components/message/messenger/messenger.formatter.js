'use strict';
import User from '../../../api/user/user.model';
var Messenger = require('./messenger.service');
var UserService = require('../../../api/user/user.service');

export function toStandard(messageObj, user){
  return new Promise(function(resolve, reject){

    UserService.getUserByMessengerId(messageObj.sender.id)
      .then(user => format(messageObj, user))
      .then(message => resolve(message))
      .catch(err => reject(err))

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
            if(obj.postback && obj.postback.payload){
              formatted.input = 'button';
              convertPayloadToStandard(formatted, obj.postback.payload)
              .then(formatted => resolve(formatted))
            } else {
              resolve(formatted);
            }
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
    convertAttachmentsToMessenger(message)
      .then(messageData => {
        message = messageData;
        return User.findById(message.userId, '_id messenger').exec()
      })
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

// Convert special components

export function convertPayloadToStandard(message, payload){
  return new Promise(function(resolve, reject){
    if(typeof payload == 'string'){
      if(payload.slice(0,4) == 'RES_'){
        message.input = 'button';
        payload = payload.slice(4);
      } else if (payload.slice(0,5) == 'SCAN_'){
        message.input = 'scan';
        payload = payload.slice(5);
      } else {
        resolve(message)
      }
      var valueStartLoc = payload.indexOf('_');
      if(valueStartLoc > -1){
        message.button = payload.slice(valueStartLoc + 1, payload.length);
      }
      resolve(message);
    } else {
      resolve(message)
    }
  })
}

function convertAttachmentsToMessenger(message){
  return new Promise((resolve, reject) => {
    if(message.type == 'button'){
      var buttons = convertButtons(message.buttons);
      message = {
        userId: message.userId,
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: message.text || ' ',
            buttons: buttons
          }
        }
      }
    }
    resolve(message)
  })
}

function convertButtons(buttons) {
  // TODO Add logic around button length and turning it into a card
  var output = [];
  buttons.forEach((button, i) => {
    var converted = {
      title: button.title
    };
    if(button.value){
      converted.type = 'postback';
      converted.payload = 'RES_' + 'null' + '_' + button.value;
      console.log('NEWBUTTON:');
      console.log(converted);
      output.push(converted);
    } else if (button.url){
      converted.type = 'web_url';
      converted.url = button.url;
      output.push(converted);
    }
  })
  return output;
}
