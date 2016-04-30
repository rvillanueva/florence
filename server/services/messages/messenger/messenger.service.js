'use strict';
import User from '../../../api/user/user.model';
var request = require("request");
var Messages = require("../../messages");
var Format = require('./messenger.formatter');
var Promise = require('bluebird');

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

export function compileMessages(obj){
  return new Promise(function(resolve, reject){
    var entries = obj.entry;
    var concatenated = [];
    entries.forEach(function(entry, i){
      var messages = entry.messaging;
      messages.forEach(function(message, j){
        concatenated.push(message);
      })
    })
    resolve(concatenated);
  })
}

export function processEachMessage(messages){
  messages.forEach(function(message, j){
    Format.toStandard(message)
      .then(formatted => {
        Messages.receive(formatted);
      })
      .catch(err => {
        console.log(err);
      })
  })
}
