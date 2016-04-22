'use strict';

describe('Component: VerifyComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var VerifyComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    VerifyComponent = $componentController('VerifyComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
