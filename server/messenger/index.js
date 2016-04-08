var Promise = require("bluebird");
var Conversations = require('../conversations');

var Messenger = function(){
  var messages = [];
  return {
    say: function(text){
      messages.push(text);
    },
    reply: function(text){
      // just log it
      //messages.push(text);
    },
    all: function(){
      return new Promise(function(resolve, reject){
        resolve(messages);
      })
    }
  }
}

export function log(userId, messages) {

}

export function response(user, response) {
  var messenger = new Messenger();
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
