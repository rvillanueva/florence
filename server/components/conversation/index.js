'use strict';

var Promise = require("bluebird");
var Interpret = require('../interpreter');
var Paths = require('./paths');
var Messages = require ('../messages');
var Conversation = require('./conversation.model').constructor;
import * as Loader from './paths/paths.loader';

export function respond(message){
  return new Promise(function(resolve, reject){
    var conversation;
    Interpret.getResponse(message)
    .then(response => {
      console.log('RESPONSE')
      console.log(response)
      conversation = new Conversation(response);
      conversation.respond();
    })
    .catch(err => reject(err))
  })
}
