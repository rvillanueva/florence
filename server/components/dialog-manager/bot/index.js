'use strict';

var Promise = require('bluebird');

var Bid = require('../strategy/bid');
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

  this.send = function(sendable){
    sendable.provider = this.user.provider;
    sendable.userId = this.user._id;
    if(this.user.provider == 'messenger'){
      sendable.messenger = this.user.messenger
    }
    return Message.send(sendable)
  }

  this.clearCache = function(){
    delete this.cache;
    this.cache = {};
  }

  this.update = function(){
    return new Promise((resolve, reject) => {
      this.state.save()
      .then(state => {
        console.log('State saved.')
        console.log(state)
        resolve(this)
      })
      .catch(err => reject(err))
    })
  }

  this.bid = function(bid){
    return new Promise((resolve, reject) => {
      this.cache.newBid = bid;
      Bid.create(this)
      .then(() => {
        this.cache.newBid = null;
        resolve(this)
      })
      .catch(err => reject(err))
    })
  }

  // SERVICES

  this.init = function(){
    return new Promise((resolve, reject) => {
      if(!this.user || !this.user._id || !this.user.provider){
        console.log(this);
        reject(new ReferenceError('Need additional user data to initialize bot.'))
      }

      if(!this.state.status){
        this.state.status = 'ready';
      }

      resolve(this)
    })
  }


}
