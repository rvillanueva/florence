'use strict';

var Promise = require('bluebird');

import User from '../../models/user/user.model';
import Task from '../../models/task/task.model';
var Queue = require('../queue');
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
      this.state.lastModified = new Date();
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
      console.log('completing task')
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

  this.loadNextTask = function(taskId){
    return new Promise((resolve, reject) => {
      console.log('loading next task from queue:')
      console.log(this.queue)
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
    })
  }

  this.setupActiveState = function(){
    return new Promise((resolve, reject) => {
      console.log('Setting up active state...')
      this.getActiveTask()
      .then(() => this.handleNoActiveStep())
      .then(() => this.findStepIndex())
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }

  this.getActiveTask = function(){
    return new Promise((resolve, reject) => {
      console.log('ANONYMOUS FUNC CHECK')
      console.log(this.queue)
      var queued = false;
      if(this.queue.length > 0){
        queued = this.queue[0];
      }
      var taskId = this.state.active.taskId || queued.taskId || false;
      console.log(taskId)
      if(typeof taskId === 'string'){
        Task.findById(taskId).lean().exec()
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

  this.handleNoActiveStep = function(){
    return new Promise((resolve, reject) => {
      console.log('checking if active step')
      if(!this.state.active.stepId && this.task && this.task.steps.length > 0){
        this.state.active.stepId = this.task.steps[0]._id;
      }
      resolve()
    })
  }

  this.findStepIndex = function(){
    return new Promise((resolve, reject) => {
      console.log('Finding step index...')
      this.stepIndex = null;
      if(this.task && this.task.steps){
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
