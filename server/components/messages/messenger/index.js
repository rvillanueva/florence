var Promise = require("bluebird");
var request = require("request");
var Messages = require("../../messages");
var Format = require('./messenger.formatter');
var Messenger = require('./messenger.service');

function sendToMessenger(message){
  return new Promise(function(resolve, reject){
    console.log('sending...')
    console.log(message)
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
          console.log(body)
          resolve(body);
        }
      })
  })
}

function processEachMessage(messages){
  console.log(messages)
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

function concatMessages(entries){
  return new Promise(function(resolve, reject){
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

function filterOutDeliveries(messages){
  return new Promise(function(resolve, reject){
    console.log(messages)
    var filtered = [];
    messages.forEach(function(message, i){
      if(message.message){
        filtered.push(message);
      }
    })
    resolve(filtered);
  })
}

export function send(message) {
  return new Promise(function(resolve, reject){
    Format.toMessenger(message)
      .then(formatted => sendToMessenger(formatted))
      .then(res => resolve(res))
      .catch(err => {
        console.log(err);
        reject(err);
      })
  })
}

export function receive(data){
  var entries = data.entry;
  concatMessages(entries)
    //.then(messages => filterOutDeliveries(messages))
    //.then(filtered => Messenger.checkUsersExist(filtered))
    .then(messages => processEachMessage(messages))
    .catch(err => console.log(err))
}
