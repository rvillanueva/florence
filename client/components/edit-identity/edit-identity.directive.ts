'use strict';

angular.module('florenceApp')
  .directive('editIdentity', function() {
    return {
      templateUrl: 'components/edit-identity/edit-identity.html',
      restrict: 'EA',
      controller: 'EditIdentityController',
      controllerAs: 'ei',
      scope: {
        user: '=',
        submitted: '=',
        errors: '=',
        form: '='
      }
    };
  });
