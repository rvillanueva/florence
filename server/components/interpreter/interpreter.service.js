'use strict';

var Wit = require('./wit');
var Aspects = require('../aspects');
var Promise = require('bluebird');

export function setupResponse(message){
  return new Promise(function(resolve, reject) {
    if(!message || !message.userId){
      reject('Invalid message data.')
    }
    var response = {
      userId: message.userId,
      message: message
    }
    resolve(response);
  })
}

export function getEntities(res) {
  // if intent = trigger, skip Wit. otherwise, interpret intent & actions
  return new Promise(function(resolve, reject) {
    console.log('Parsing intent and entities...')
    if (skip) {
      resolve(skip)
    } else {
      if(res.message.text && !res.intent){
        Wit.getEntities(res.message, res.context)
        .then(entities => {
          res.entities = entities;
          resolve(res)
        })
        .catch(err => {
          console.log('Wit response error: ')
          console.log(err)
          resolve(res);
        })
      } else {
        resolve(res)
      }
    }
  })

}


export function redirectByIntent(res) {
  // hardcode some commands in here
  return new Promise(function(resolve, reject) {
    // Build in some logic to redirect if there's an intent
    resolve(res);
  })
}

export function mergeEntities(res) {
  res.context = res.context || {};
  res.context.entities = res.context.entities || {};
  for (var key in res.context.entities) {
    if (res.context.entities.hasOwnProperty(key)) {
      if (!res.entities[key]) {
        res.entities[key] = res.context.entities[key];
      }
    }
  }
  return res;
}

export function convertButtonPayload(res){
  return new Promise(function(resolve, reject){
    console.log('CONVERTING BUTTON PAYLOAD');
    //EXPECTED FORMAT
    // RES_stepId_buttonValue
    // CODE_protocol_data
    res.entities = res.entities || {};
    if(res.message.postback && typeof res.message.postback == 'string'){
      var payload = res.message.postback;
      var intentEndLoc;
      var newEntities;
      if(payload.slice(0,4) == 'RES_'){
        res.type = 'responseBtn';
        payload = payload.slice(4)
      }
      if(payload.slice(0,5) == 'CODE_'){
        res.type = 'conversionCode';
        payload = payload.slice(5);
      } else {
        resolve(res)
      }
      stepEndLoc = payload.indexOf('_');
      if(stepEndLoc > -1){
        var stepId = payload.slice(0, stepEndLoc);
        if(stepId !== res.context.stepId){
          res.expired = true;
        }
        payload = payload.slice(stepEndLoc + 1);
      } else {
        resolve(res);
      }
      if(payload.length > 0){
        res.entities.button = payload;
      }
      resolve(res);
    } else {
      resolve(res)
    }
  })
}
