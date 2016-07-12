'use strict';

var Promise = require('bluebird');

import User as '../../api/user';
var Queue = require('../queue');
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
  this.state = options.user.state || {};
  this.queue = options.user.queue || [];
  this.received = options.received;

  this.loops = 0;

  // METHODS

  this.send = function(sendable){
    sendable.provider = this.user.provider;
    sendable.userId = this.user._id;
    if(this.user.provider == 'messenger'){
      sendable.messenger = this.user.messenger
    }
    return Message.send(sendable)
  }

  this.update = function(){
    return new Promise((resolve, reject) => {
      this.state.lastModified = new Date();
      this.state
      User.findById(this.user._id)
      .then(user => {
        user.state = this.state;
        user.queue = this.queue;
        return User.update(this.user._id, user)
      })
      .then(user => {
        this.user = user;
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

  this.completeTask = function(taskId){
    return new Promise((resolve, reject) => {
      Queue.completeTodo(this.queue, taskId)
      .then(queue => {
        this.queue = queue;
        this.task = null;
        this.stepIndex = null;
        this.state.active = {
          taskId: null,
          stepId: null
        }
        resolve(this)
      })
      .catch(err => reject(err))
    })
  }

  this.loadNextTask = function(taskId){
      if(this.queue.length > 0){
        this.state.active.taskId = todo.taskId;
        this.setupActiveState()
        .then(() => resolve(this))
        .catch(err => reject(err))
      } else {
        this.task = null;
        this.stepIndex = null;
        resolve(this)
      }

      function handleEmptyQueue(){
        this.state.status = 'waiting';
        return this.send({
          text: 'Done!'
        })
      }
  }

  this.setupActiveState = function(){
    return new Promise((resolve, reject) => {
    getActiveTask()
    .then(handleNoActiveStep())
    .then(findStepIndex())
    .catch(err => reject(err))
  })

    function getActiveTask(){
      return new Promise((resolve, reject) => {
        Task.findById(this.state.active.taskId).lean().exec()
        .then(task => {
          this.task = task;
          resolve()
        })
        .catch(err => reject(err))
      })
    }

    function handleNoActiveStep(){
      return new Promise((resolve, reject) => {
        if(!this.state.active.stepId && bot.task.steps.length > 0){
          this.state.active.stepId = bot.task.steps[0]._id;
        }
      })
    }

    function findStepIndex(){
      return new Promise((resolve, reject) => {
        this.stepIndex = null;
        this.task.steps.forEach(function(step, s){
          if(step._id == this.state.active.stepId){
            this.stepIndex = s;
          }
        })
        if(!bot.stepIndex){
          this.stepIndex = 0;
        }
      })
    }
  }




  // SERVICES

  this.init = function(){
    return new Promise((resolve, reject) => {
      if(!this.user || !this.user._id || !this.user.provider){
        console.log('INITIALIZING BOT:')
        console.log(this);
        reject(new ReferenceError('Need additional user data to initialize bot.'))
      }

      this.state.status = this.state.status || 'waiting';
      this.state.stored = this.state.stored || {};

      resolve(this)
    })
  }


}
