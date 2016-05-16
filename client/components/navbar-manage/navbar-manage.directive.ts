'use strict';

angular.module('riverApp')
  .directive('navbarManage', () => ({
    templateUrl: 'components/navbar-manage/navbar-manage.html',
    restrict: 'E',
    controller: 'NavbarManageController',
    controllerAs: 'nav-manage'
  }));
