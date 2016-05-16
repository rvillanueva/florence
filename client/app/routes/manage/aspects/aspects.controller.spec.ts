'use strict';

describe('Component: AspectsComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var AspectsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    AspectsComponent = $componentController('AspectsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
