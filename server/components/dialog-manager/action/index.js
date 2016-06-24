'use strict';

var ActionService = require('./action.service')

export function execute(bot){
  return ActionService.execute(bot);
}
