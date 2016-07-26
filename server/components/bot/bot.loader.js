'use strict';

var Promise = require('bluebird');
var Queue = require('../queue');
var TaskService = require('../task');

export function loadNextStep(){
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


// HIDDEN METHODS

export function initLoaderMethods(){
  this.handleNoTask = handleNoTask;
  this.loadActiveTask = loadActiveTask;
  this.handleSteplessTask = handleSteplessTask;
  this.loadActiveStep = loadActiveStep;
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

function handleSteplessTask(){
  return new Promise((resolve, reject) => {
    console.log('Active load is:')
    console.log(this.loaded.task)
    if(this.loaded.task && (!this.loaded.task.steps || this.loaded.task.steps.length == 0)){
      console.log(this.state.active)
      console.log('Task has no steps, completing and loading next step');
      this.completeTask()
      .then(() => resolve(this))
      .catch(err => reject(err))
    } else {
      resolve(this)
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

function loadActiveStep(){
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
