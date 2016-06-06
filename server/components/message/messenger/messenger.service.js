'use strict';
var Promise = require('bluebird');
var request = require('request');
var Format = require('./messenger.formatter');

export function sendToApi(message){
  return new Promise(function(resolve, reject){
      var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          access_token: process.env.FB_PAGE_TOKEN
        },
        json: true,
        body: message
      }
      request.post(options, function(err, response, body){
        if(err){
          console.log(err)
          reject(err)
        } else {
          resolve(body);
        }
      })
  })
}

export function convertToArray(obj){
  return new Promise(function(resolve, reject){
    var entries = obj.entry;
    var array = [];
    entries.forEach(function(entry, i){
      var messages = entry.messaging;
      messages.forEach(function(message, j){
        array.push(message);
      })
    })
    resolve(array);
  })
}

export function formatEachMessage(messages){
  return new Promise(function(resolve, reject){
    var formatted = []
    messages.forEach(function(message, j){
      formatted.push(Format.toStandard(message))
    })
    Promise.all(promises)
    .then(() => resolve(formatted))
    .catch(err => reject(err))
  })
}
