'use strict';
import LoginController from './login.controller';

export default angular.module('florenceApp.login', [])
  .controller('LoginController', LoginController)
  .name;
