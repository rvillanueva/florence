'use strict';
var Promise = require('bluebird');
var request = require('request');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_SECRET);

export function sendToApi(message) {
  return new Promise(function(resolve, reject) {
    if(process.env.NODE_ENV == 'production'){
      twilio.sendMessage({
        to: message.to.mobile,
        from: process.env.TWILIO_PHONE,
        body: message.content.text
      }, function(err, responseData) {
        if (!err) {
          console.log('Sent!')
          message.meta = {
            twilioSms: {
              delivery: responseData
            }
          }
          resolve(message)
        } else {
          console.log('TWILIO ERROR:')
          console.log(err)
          reject(new Error(err.message))
        }
      });
    } else {
      console.log('\n\n\n\n\n\n')
      console.log('SENDING MESSAGE: ' + message.content.text)
      console.log('\n\n\n\n\n\n')
      resolve(message);
    }
  })
}
