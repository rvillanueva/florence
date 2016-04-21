'use strict';

describe('Component: SentComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var SentComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    SentComponent = $componentController('SentComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
