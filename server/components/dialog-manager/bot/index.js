'use strict';

export default function(user, state, received){

  // PROPERTIES

  var user = user || {};

  this.user = user;
  this.state = state || {};
  this.received = received;

  this.conversations = [];
  this.cache = {};

  // METHODS

  this.send = function(sendables){

  }

  this.clearCache = function(){
    delete this.cache;
    this.cache = {};
  }

  this.update = function(){
    return new Promise(function(resolve, reject){
      this.state.save()
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }

  this.init = function(){
    return new Promise((resolve, reject) => {
      if(!this.user || !this.user._id || !this.user.provider){
        reject(new ReferenceError('Need additional user data to initialize bot.'))
      }

      resolve(this)

    })
  }

}
