'use strict';

var ActionService = require('./action.service')

export function execute(action){
  return ActionService.execute(action);
}
