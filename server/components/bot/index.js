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
      this.handleNoTask()
      .then(() => this.loadActiveTask())
      .then(() => this.handleSteplessTask())
      .then(() => this.loadActiveStep())
      .then(() => resolve(this))
      .catch(err => reject(err))
    })

  }

  this.handleNoTask = function(){
    return new Promise((resolve, reject) => {
      if(!this.state.active.taskId){
        console.log('No task loaded, loading next task from queue...')
        this.setNextTask()
        .then(() => resolve())
        .catch(err => reject(err))
      } else {
        resolve()
      }
    })
  }


  this.loadActiveTask = function(){
    return new Promise((resolve, reject) => {
      var taskId = this.state.active.taskId;
      if(typeof taskId === 'string'){
        TaskService.getById(taskId)
        .then(task => {
          if(!task){
            this.state.active = {
              taskId: null,
              stepId: null
            }
          }
          this.loaded.task = task || false;
          resolve()
        })
        .catch(err => reject(err))
      } else {
        this.loaded.task = false
        resolve(this)
      }
    })
  }

  this.handleSteplessTask = function(){
    return new Promise((resolve, reject) => {
      console.log('Active load is:')
      console.log(this.loaded.task)
      if(this.loaded.task && (!this.loaded.task.steps || this.loaded.task.steps.length == 0)){
        console.log(this.state.active)
        console.log('Task has no steps, completing and loading next step');
        this.completeTask()
        .then(() => resolve())
        .catch(err => reject(err))
      } else {
        resolve()
      }
    })
  }

  this.loadActiveStep = function(){
    return new Promise((resolve, reject) => {
        console.log('Finding step index...')
        console.log(this.state.active)
        if(this.loaded.task){
          if (!this.state.active.stepId){
            this.state.active.stepId = this.loaded.task.steps[0]._id;
          }

          this.loaded.task.steps.forEach((step, s) => {
            if(step._id == this.state.active.stepId){
              this.loaded.stepIndex = s;
            }
          })

          if(!this.loaded.stepIndex){
            this.loaded.stepIndex = 0;
            this.state.active.stepId = this.loaded.task.steps[0]._id;
          }

          this.loaded.step = this.loaded.task.steps[this.loaded.stepIndex];
          console.log(this.loaded.stepIndex)
          resolve(this)
        } else {
          this.loaded.stepIndex = false;
          this.loaded.step = false;
          resolve(this)
        }

    })
  }

  this.loadNextTask = function(){
    return new Promise((resolve, reject) => {
      this.setNextTask()
      .then(() => this.loadActive())
      .then(() => resolve())
      .catch(err => reject(err))
    })
  }

  this.setNextTask = function(){
    return new Promise((resolve, reject) => {
      this.loaded = {
        task: false,
        step: false,
        stepIndex: false
      }
      if(this.queue.length > 0 && this.queue[0].taskId){
        this.state.active = {
          taskId: this.queue[0].taskId,
          stepId: null
        }
        console.log('New task set:')
        console.log(this.state.active);
      } else {
        this.state.active = {
          taskId: null,
          stepId: null
        }
        console.log('No task set, continuing...')
      }
      resolve()
    })
  }

  this.loadNextStep = function(){
    return new Promise((resolve, reject) => {
      this.loaded.stepIndex ++;
      if(this.loaded.task && this.loaded.task.steps && this.loaded.task.steps.length > 0){
        if(this.loaded.stepIndex > (this.loaded.task.steps.length - 1)){
          this.completeTask()
          .then(() => resolve(this))
          .catch(err => reject(err))
        } else {
          this.state.active.stepId = this.loaded.task.steps[this.loaded.stepIndex]._id;
          this.loadActiveStep()
          .then(() => resolve(this))
          .catch(err => reject(err))
        }
      } else {
        resolve(this)
      }

    })
  }




  // SERVICES

  this.init = function(){
    return new Promise((resolve, reject) => {

      this.state.status = this.state.status || 'waiting';
      this.state.active = this.state.active || {};
      this.loadActive()
      .then(() => resolve(this))
      .catch(err => reject(err))
    })
  }


}
