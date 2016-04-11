var Promise = require("bluebird");
var Conversations = require('../conversations');

var Messenger = function(user){
  var messages = [];
  var user = user;

  var log = function(user, messages){
    if(!user.log){
      user.log = []
    }
    user.log.push(messages);
  }

  return {
    say: function(text){
      messages.push(text);
    },
    reply: function(text){
      log(user, text)
    },
    all: function(){
      return new Promise(function(resolve, reject){
        resolve(messages);
      })
    }
  }
}

export function response(user, response) {
  var messenger = new Messenger(user);
  return new Promise(function(resolve, reject){
    Conversations.respond(null, messenger)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      })
  })
}
