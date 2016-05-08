'use strict';

var Wit = require('./wit');
var Promise = require('bluebird');

export function getEntities(bot) {
  // if intent = trigger, skip Wit. otherwise, interpret intent & actions
  return new Promise(function(resolve, reject) {
    bot.state = bot.state || {};
    bot.state.entities = bot.state.entities = {};
    if(bot.message.button){
      bot.state.entities.button = bot.message.button;
    }
    if (bot.message.text && !bot.state.intent) {
      Wit.getEntities(bot.message, null) // should add context
        .then(newEntities => {
          //bot.state.entities = mergeEntities(bot.state.entities, newEntities); FIXME need to pull outcomes from Wit response
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

export function mergeEntities(entities, newEntities) {
  entities = entities || {};
  for (var key in newEntities) {
    if (newEntities.hasOwnProperty(key)) {
      if (!entities[key]) {
        entities[key] = newEntities[key];
      }
    }
  }
  return entities;
}
