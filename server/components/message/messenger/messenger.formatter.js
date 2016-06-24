'use strict';
var Messenger = require('./messenger.service');

export function toStandard(messageObj) {
  return new Promise(function(resolve, reject) {
    format(messageObj)
      .then(message => resolve(message))
      .catch(err => reject(err))

    function format(obj) {
      return new Promise(function(resolve, reject) {
        var formatted = {
          messenger: {
            id: obj.sender.id
          },
          date: obj.timestamp,
          provider: 'messenger'
        }

        if (obj.message) {
          formatted.messenger.mid = obj.message.mid;
          formatted.messenger.seq = obj.message.seq;
          formatted.text = obj.message.text;
          formatted.attachments = obj.message.attachments;
        }

        if (formatted.text) {
          formatted.type = 'text';
        }
        if (obj.postback && obj.postback.payload) {
          formatted.type = 'button';
          convertPayloadToStandard(formatted, obj.postback.payload)
            .then(formatted => resolve(formatted))
        } else {
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
    if (!message.messenger || !message.messenger.id) {
      reject(new TypeError('No messenger id provided.'))
    } else {
      formatted.recipient = {
        id: message.messenger.id
      }
    }
    convertAttachmentsToMessenger(message)
      .then(messageData => {
        message = messageData;


        if (message.text) {
          formatted.message.text = message.text;
        }

        if (message.attachment) {
          formatted.message.attachment = message.attachment;
        }

        if (!formatted.message.text && !formatted.message.attachment) {
          reject(new TypeError('Message contained no content.'));
        }
        console.log('Formatted:')
        console.log(formatted)
        resolve(formatted);

      })
      .catch(err => reject(err))
  })
}

// Convert special components

export function convertPayloadToStandard(message, payload) {
  return new Promise(function(resolve, reject) {
    if (typeof payload == 'string') {
      if (payload.slice(0, 4) == 'RES_') {
        message.input = 'button';
        payload = payload.slice(4);
      } else if (payload.slice(0, 5) == 'SCAN_') {
        message.input = 'scan';
        payload = payload.slice(5);
      } else {
        resolve(message)
      }
      var valueStartLoc = payload.indexOf('_');
      if (valueStartLoc > -1) {
        message.button = payload.slice(valueStartLoc + 1, payload.length);
      }
      resolve(message);
    } else {
      resolve(message)
    }
  })
}

function convertAttachmentsToMessenger(message) {
  return new Promise((resolve, reject) => {
    if (message.type == 'button') {
      var buttons = convertButtons(message.buttons);
      message = {
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
    if (button.value) {
      converted.type = 'postback';
      converted.payload = 'RES_' + 'null' + '_' + button.value;
      console.log('NEWBUTTON:');
      console.log(converted);
      output.push(converted);
    } else if (button.url) {
      converted.type = 'web_url';
      converted.url = button.url;
      output.push(converted);
    }
  })
  return output;
}
