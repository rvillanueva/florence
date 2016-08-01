'use strict';

angular.module('florenceApp.auth', [
  'florenceApp.constants',
  'florenceApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
