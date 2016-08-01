'use strict';

describe('Component: PatientsComponent', function () {

  // load the controller's module
  beforeEach(module('florenceApp'));

  var PatientsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    PatientsComponent = $componentController('PatientsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
