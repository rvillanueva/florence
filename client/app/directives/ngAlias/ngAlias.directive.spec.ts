'use strict';

describe('Directive: ngAlias', function () {

  // load the directive's module
  beforeEach(module('riverApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-alias></ng-alias>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngAlias directive');
  }));
});
