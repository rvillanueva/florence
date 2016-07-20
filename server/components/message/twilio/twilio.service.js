'use strict';
var Promise = require('bluebird');
var request = require('request');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_SECRET);

export function sendToApi(message) {
  return new Promise(function(resolve, reject) {
    twilio.sendMessage({
      to: message.to.mobile,
      from: process.env.TWILIO_PHONE,
      body: message.content.text
    }, function(err, responseData) {
      if (!err) {
        console.log('Sent!')
        resolve(responseData)
      } else {
        console.log('TWILIO ERROR:')
        console.log(err)
        reject(new Error(err.message))
      }
    });
  })
}
