'use strict';

var Promise = require('bluebird');

import User from '../../models/user/user.model';
var Queue = require('../queue');
var TaskService = require('../task');
var Message = require('../message');
var BotLoaderService = require('./bot.loader');

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
  this.state = options.user.state || {};
  this.queue = options.user.queue || [];
  this.received = options.received;
  this.loaded = {
    task: null,
    stepIndex: null,
    step: null
  }
  this.loops = 0;

  // METHODS

  this.send = function(sendable){
    return new Promise((resolve, reject) => {
      var sent = {
        userId: this.user._id,
        content: {
          text: sendable.text
        },
        to: {
          provider: this.user.providers.messaging,
          mobile: this.user.identity.mobile
        }
      }
      Message.send(sent)
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }

  this.update = function(){
    return new Promise((resolve, reject) => {
      console.log('updating...')
      this.state.lastModified = new Date();
      User.findById(this.user._id)
      .then(user => {
        console.log('user found...')
        user.state = this.state;
        user.queue = this.queue;
        console.log(user.state);
        return User.findOneAndUpdate({'_id': this.user._id}, user)
      })
      .then(user => {
        this.user = user;
        console.log('State saved!')
        resolve(this)
      })
      .catch(err => reject(err))
    })
  }

  this.addTodo = function(todo){
    return new Promise((resolve, reject) => {
      Queue.addTodo(this.queue, todo)
      .then(queue => {
        this.queue = queue;
        resolve(this)
      })
      .catch(err => reject(err))
    })
  }

  this.completeTask = function(){
    return new Promise((resolve, reject) => {
      Queue.completeTodo(this.queue, this.state.active.taskId)
      .then(queue => {
        console.log(queue)
        this.queue = queue;
        this.loaded = {
          task: null,
          stepIndex: null
        }
        this.state.active = {
          taskId: null,
          stepId: null
        }
        console.log('task complete')
        return this.loadNextTask();
      })
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }



  // LOADING

  this.loadActive = function(){
    return new Promise((resolve, reject) => {
      console.log('Setting up active state...')
      this.loadActiveTask()
      .then(() => this.loadActiveStep())
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }
  this.loadNextStep = BotLoaderService.loadNextStep;
  this.loadNextTask = BotLoaderService.loadNextTask;
  this.initLoaderMethods = BotLoaderService.initLoaderMethods;



  // SERVICES

  this.init = function(){
    return new Promise((resolve, reject) => {

      this.state.status = this.state.status || 'waiting';
      this.state.active = this.state.active || {};
      this.initLoaderMethods();
      this.loadActive()
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }


}
