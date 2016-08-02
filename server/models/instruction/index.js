'use strict';

var Promise = require('bluebird');
import Instruction from './instruction.model';
import User from '../user/user.model';

export function create(instruction){
  return new Promise(function(resolve, reject){
    Instruction.create(instruction)
    .then(instruction => resolve(instruction))
    .catch(err => reject(err))
  })
}

function getById(instructionId){
  return new Promise(function(resolve, reject){
    User.findOne({'instructions._id': instructionId})
    .then(user => extractInstruction(user))
    .then(instruction => resolve(instruction))
    .catch(err => reject(err))
  })

  function extractInstruction(user){
    return new Promise(function(resolve, reject){
      var returned = false;
      if(!user){
        reject(new Error('No user found for instruction with _id ' + instructionId))
      }
      user.instructions = user.instructions || [];
      user.instructions.forEach(function(instruction, i){
        if(instruction._id == instructionId){
          returned = instruction;
        }
      })
      if(returned){
        resolve(returned);
      } else {
        reject('No matching instruction with _id ' + instruction._id + ' found for user with _id ' + user._id);
      }
    })
  }
}
