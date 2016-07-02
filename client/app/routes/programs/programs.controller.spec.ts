'use strict';

describe('Component: ProgramsComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var ProgramsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ProgramsComponent = $componentController('ProgramsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
