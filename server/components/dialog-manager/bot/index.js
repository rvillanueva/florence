'use strict';

export default function(userId, received){

  // PROPERTIES

  this.userId = userId;
  this.provider;
  this.received = received;
  this.state = {
    status: null
  }
  this.conversations = {
    current: false,
    past: []
  }

  this.cache = {};

  this.loaded = {};

  // METHODS

  this.send = function(sendables){

  }

  this.clearCache = function(){
    this.cache = {};
  }

  this.update = function(){
    // Save
    return this;
  }

  this.init = function(){
    return new Promise(function(resolve, reject){
      resolve(this)
    })
  }

}
