'use strict';

var Promise = require('bluebird');
import User from '../models/user/user.model';
import config from '../config/environment';
var CronJob = require('cron').CronJob;
var InstructionService = require('../components/instruction');

var cronHourlyPattern = '0 0 1-18 * * *';
var cronHalfMinutePattern = '*/30 * 12-18 * * *'
var assignedInterval = cronHourlyPattern;

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
