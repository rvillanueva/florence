'use strict';

var Promise = require('bluebird');
var Queue = require('../queue');
var TaskService = require('../task');

// HIDDEN METHODS

export function initLoaderMethods(){
  this.handleNoTask = handleNoTask;
  this.loadActiveTask = loadActiveTask;
  this.setNextTask = setNextTask;
}

function handleNoTask(){
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

function loadActiveTask(){
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
        resolve()
      })
      .catch(err => reject(err))
    } else {
      this.loaded.task = false
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

function setNextTask(){
  return new Promise((resolve, reject) => {
    this.loaded = {
      task: false,
    }
    if(this.queue.length > 0 && this.queue[0].taskId){
      this.state.active = {
        taskId: this.queue[0].taskId,
      }
      console.log('New task set:')
      console.log(this.state.active);
    } else {
      this.state.active = {
        taskId: null,
      }
      console.log('No task set, continuing...')
    }
    resolve()
  })
}
