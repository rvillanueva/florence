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


export function toTwilio(message) {
  return new Promise(function(resolve, reject) {

    message.mobile.number
  })
}
