'use strict';

var Promise = require('bluebird');
import * as Loader from './paths.loader';

var paths = {};

export function add(intent, path){
  if(paths[intent]){
    console.log('Error: Function for ' + intent + ' already exists.');
  } else {
    paths[intent] = path;
  }
}


export function start(intent, conversation){
  return new Promise((resolve, reject) => {
    if(!paths[intent] && !paths[intent].start){
      reject('No matching intent found.')
    } else {
      paths[intent](conversation, response).start()
    }
  })
}

export function respond(intent, conversation){
  return new Promise((resolve, reject) => {
    if(!paths[intent] && !paths[intent].respond){
      reject('No matching intent found.')
    } else {
      paths[intent](conversation, response).respond()
    }
  })
}
