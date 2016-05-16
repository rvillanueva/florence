'use strict';

describe('Component: ViewComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var ViewComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ViewComponent = $componentController('ViewComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
