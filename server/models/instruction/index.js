'use strict';

var Promise = require('bluebird');
import Instruction from './instruction.model';

export function create(instruction){
  return new Promise(function(resolve, reject){
    Instruction.create(instruction)
    .then(instruction => resolve(instruction))
    .catch(err => reject(err))

  })
}
