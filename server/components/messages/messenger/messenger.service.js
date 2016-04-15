'use strict';
import User from '../../../api/user/user.model';
var request = require("request");
var Messages = require("../../messages");
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

export function createUserIfNeeded(messengerId){
  return new Promise(function(resolve, reject){
    User.findOne({'messenger.id': messengerId}, '_id').exec()
    .then(user => {
      if(user){
        resolve(user);
      } else {
        var userData = {
          messenger: {
            id: messengerId
          },
        }
        var newUser = new User(userData);
        newUser.provider = 'facebook';
        newUser.role = 'user';
        newUser.context = {
          intent: 'hello',
          entities: {},
          needed: []
        }
        newUser.save()
          .then(user => {
            resolve(user);
          })
          .catch(err => {
            reject(err);
          })
      }
    })
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


/*

export function checkUsersExist(messages){
  return new Promise(function(resolve, reject){
    console.log('checking if users exist...')
    var idIndex = []
    var checkedCounter = 0;
    messages.forEach(function(message, j){
      var senderId = message.sender.id;
      var found = false;
      idIndex.forEach(function(id, k){
        if(id == message.sender.id){
          found = true;
        }
      })
      if(!found){
        idIndex.push(senderId);
      }
    })
    idIndex.forEach(function(id, i){
      checkUserExists(senderId);
    })

    function checkUserExists(messengerId){
      User.findOne({'messenger.id': messengerId}, '_id').exec()
        .then(user => {
          if(!user){
            console.log('No user found for messenger id: ' + messengerId)
            createMessengerUser(messengerId)
            .then(checkIfDone())
            .catch(err => {
              console.log('error: ')
              console.log(err)
            })
          } else {
            checkIfDone();
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    function checkIfDone(){
      checkedCounter++;
      if(checkedCounter == idIndex.length){
        console.log('done')
        resolve();
      } else if(checkedCounter > idIndex.length){
        console.log('error with counter')

        reject('Something is wrong with your check user counter...');
      }
    }
  })
}

export function filterOutDeliveries(messages){
  return new Promise(function(resolve, reject){
    var filtered = [];
    messages.forEach(function(message, i){
      if(message.message){
        filtered.push(message);
      }
    })
    resolve(filtered);
  })
}

*/
