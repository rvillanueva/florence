'use strict';

var Promise = require("bluebird");
var Interpret = require('../interpreter');
var Paths = require('./paths');
var Messages = require ('../messages');
var Conversation = require('./conversation.model').constructor;
var ConversationService = require('./conversation.service');
import * as Loader from './paths/paths.loader';

export function respond(message){
  return new Promise(function(resolve, reject){
    var conversation =
    Interpret.getResponse(message)
    .then(res => setup(res))
    .then(convo => ConversationService.run(convo))
    .catch(err => reject(err))
  })
}

export function setup(response){
  return new Promise(function(resolve, reject){
    var conversation = new Conversation(response);
    resolve(conversation);
  })
}
