'use strict';

describe('Component: ConversationsComponent', function () {

  // load the controller's module
  beforeEach(module('riverApp'));

  var ScriptsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ScriptsComponent = $componentController('ScriptsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
