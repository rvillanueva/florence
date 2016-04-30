'use strict';

var Wit = require('./wit');
var Promise = require('bluebird');

export function getEntities(bot) {
  // if intent = trigger, skip Wit. otherwise, interpret intent & actions
  return new Promise(function(resolve, reject) {
    console.log('Parsing intent and entities...')
    if (bot.message.text && !bot.state.intent) {
      Wit.getEntities(bot.message, bot.context)
        .then(entities => {
          bot.entities = entities;
          resolve(bot)
        })
        .catch(err => {
          console.log('Wit response error: ')
          console.log(err)
          resolve(bot);
        })
    } else {
      resolve(bot)
    }
  })

}

export function mergeEntities(bot) {
  bot.state = bot.state || {};
  bot.state.entities = bot.state.entities || {};
  for (var key in bot.state.entities) {
    if (bot.state.entities.hasOwnProperty(key)) {
      if (!bot.entities[key]) {
        bot.entities[key] = bot.state.entities[key];
      }
    }
  }
  return bot;
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
