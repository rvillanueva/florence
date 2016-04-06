'use strict';

angular.module('riverApp.auth', [
  'riverApp.constants',
  'riverApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
