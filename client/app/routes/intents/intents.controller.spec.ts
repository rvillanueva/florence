'use strict';

describe('Component: IntentsComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var IntentsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    IntentsComponent = $componentController('IntentsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
