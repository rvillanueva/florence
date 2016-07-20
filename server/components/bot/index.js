'use strict';

var Promise = require('bluebird');

import User from '../../models/user/user.model';
var Queue = require('../queue');
var TaskService = require('../task');
var Message = require('../message');

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
    return Message.send(sent)
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

  this.completeTask = function(taskId){
    return new Promise((resolve, reject) => {
      Queue.completeTodo(this.queue, taskId)
      .then(queue => {
        console.log(queue)
        this.queue = queue;
        this.task = null;
        this.stepIndex = null;
        this.state.active = {
          taskId: null,
          stepId: null
        }
        console.log('task complete')
        resolve(this)
      })
      .catch(err => reject(err))
    })
  }

  this.setupActiveState = function(){
    return new Promise((resolve, reject) => {
      console.log('Setting up active state...')
      this.getActiveTask()
      .then(() => this.findStepIndex())
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }

  this.getActiveTask = function(){
    return new Promise((resolve, reject) => {
      var queued = false;
      if(this.queue.length > 0){
        queued = this.queue[0];
      }
      var taskId = this.state.active.taskId || queued.taskId || false;
      if(typeof taskId === 'string'){
        TaskService.getById(taskId)
        .then(task => {
          this.task = task || false;
          resolve()
        })
        .catch(err => reject(err))
      } else {
        this.task = false
        resolve()
      }
    })
  }

  this.findStepIndex = function(){
    return new Promise((resolve, reject) => {
      console.log('Finding step index...')
      this.stepIndex = null;
      if(this.task && this.task.steps && this.state.active.stepId){
        console.log(this.task)
        this.task.steps.forEach((step, s) => {
          if(step._id === this.state.active.stepId){
            this.stepIndex = s;
          }
        })
        if(!this.stepIndex){
          this.stepIndex = 0;
        }
      }
      resolve()
    })
  }




  // SERVICES

  this.init = function(){
    return new Promise((resolve, reject) => {

      this.state.status = this.state.status || 'waiting';
      this.state.active = this.state.active || {};
      this.setupActiveState()
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }


}
