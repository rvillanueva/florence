'use strict';

export default function(userId, received){

  // PROPERTIES

  this.userId = userId;
  this.provider;
  this.received = received;
  this.status = null;
  this.bot = {
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
    //save
    return this;
  }

  this.setStatus = function(status){
    this.status = status;
    return this.update();
  }

  this.init = function(){
    return new Promise(function(resolve, reject){
      resolve(this)
    })
  }

}
