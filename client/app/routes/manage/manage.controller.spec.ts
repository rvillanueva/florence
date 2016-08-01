'use strict';

describe('Component: ManageComponent', function () {

  // load the controller's module
  beforeEach(module('florenceApp'));

  var ManageComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ManageComponent = $componentController('ManageComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
