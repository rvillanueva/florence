'use strict';

var Promise = require('bluebird');
import User from '../models/user/user.model';
import config from '../config/environment';
var CronJob = require('cron').CronJob;
var InstructionService = require('../services/instruction');

var hourly = '0 0 13-18 * * *';
var halfMinute = '*/30 * 12-18 * * *';
var assignedInterval = hourly;

export function init() {
  new CronJob(assignedInterval, function() {
    runNotifications();
  }, null, true, 'America/New_York');
}

export function runNotifications() {
  return new Promise(function(resolve, reject) {
    InstructionService.runCheckIns();
  })
}
