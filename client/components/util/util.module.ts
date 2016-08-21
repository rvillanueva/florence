'use strict';
import {UtilService} from './util.service';

export default angular.module('florenceApp.util', [])
  .factory('Util', UtilService)
  .name;
