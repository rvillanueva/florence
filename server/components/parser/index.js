'use strict';

var Wit = require('./wit')

export function classify(text){
  return Wit.classify(text);
}
