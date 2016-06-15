'use strict';

var Promise = require('bluebird');
var Message = require('../../message');

/*
USER DATA REQUIRED:
------------------
_id
provider

*/

export default function(options){

  // PROPERTIES
  options = options || {};

  this.user = options.user;
  this.state = options.state || {};
  this.received = options.received;

  this.conversations = [];
  this.cache = {};

  // METHODS

  this.send = function(sendables){
    return new Promise((resolve, reject) => {
      var promises = [];
      sendables.forEach(sendable => {
        promises.push(Message.send(sendables))
      })
      Promise.all(promises)
      .then(() => resolve(true))
      .catch(err => reject(err))
    })
  }

  this.clearCache = function(){
    delete this.cache;
    this.cache = {};
  }

  this.update = function(){
    return new Promise((resolve, reject) => {
      this.state.save()
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }

  this.init = initialize();

// SERVICES

  function initialize(){
    return new Promise((resolve, reject) => {

      if(!this.user || !this.user._id || !this.user.provider){
        reject(new ReferenceError('Need additional user data to initialize bot.'))
      }

      if(!this.state.status){
        this.state.status = 'ready';
      }

      resolve(this)
    })
  }


}
