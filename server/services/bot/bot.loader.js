'use strict';

var Promise = require('bluebird');
var Queue = require('../queue');
var TaskService = require('../task');

// HIDDEN METHODS

export function handleNoTask(){
  return new Promise((resolve, reject) => {
    console.log(this)
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

export function loadActive(){
  return new Promise((resolve, reject) => {
    this.handleNoTask()
    .then(() => this.loadActiveTask())
    .then(() => resolve())
    .catch(err => reject(err))
  })
}

export function loadActiveTask(){
  return new Promise((resolve, reject) => {
    var taskId = this.state.active.taskId;
    if(typeof taskId === 'string'){
      TaskService.getById(taskId)
      .then(task => {
        if(!task){
          this.state.active = {
            taskId: null,
          }
        }
        this.loaded.task = task || false;
        this.loaded.params = this.state.active.params || {};
        resolve()
      })
      .catch(err => reject(err))
    } else {
      this.loaded = {
        task: false,
        params: false
      }

      resolve(this)
    }
  })
}

export function loadNextTask(){
  return new Promise((resolve, reject) => {
    this.setNextTask()
    .then(() => this.loadActive())
    .then(() => resolve(this))
    .catch(err => reject(err))
  })
}

export function setNextTask(){
  return new Promise((resolve, reject) => {
    this.loaded = {
      task: false,
    }
    if(this.queue.length > 0 && this.queue[0].taskId){
      this.state.active = {
        taskId: this.queue[0].taskId,
        params: this.queue[0].params
      }
      console.log('New task set:')
      console.log(this.state.active);
    } else {
      this.state.active = {
        taskId: null,
        params: null
      }
      console.log('No task set, continuing...')
    }
    resolve()
  })
}
