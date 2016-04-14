var Promise = require("bluebird");
var request = require("request");
var Messages = require("../../messages");
var Format = require('./messenger.formatter');
var Messenger = require('./messenger.service');
import User from '../../../api/user/user.model';

function sendToMessenger(){
  return new Promise(function(resolve, reject){
      var options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.FB_PAGE_TOKEN,
        body: body
      }
      request.post(options).success(function(err, response, body){
        console.log(JSON.stringify(body));
        resolve(body);
      })
  })
}

function processEntries(entries){
  entries.forEach(function(entry, i){
    var messages = entries.messaging;
    messages.forEach(function(message, j){
      Format.toStandard(message)
        .then(formatted => {
          Messages.receive(formatted);
        })
        .catch(err => {
          console.log(err);
        })
    })
  })
}

export function send(message) {
  return new Promise(function(resolve, reject){
    Format.toMessenger(message)
    .then(formatted => sendToMessenger(formatted))
    .then(res => resolve(res))
    .catch(err => {
      console.log(JSON.stringify(err));
    })
  })
}

export function receive(data){
  var entries = data.entry;
  Messenger.checkNewUsers(entries)
    .then(processEntries(entries))
}
