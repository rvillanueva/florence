'use strict';

describe('Component: QuestionsComponent', function () {

  // load the controller's module
  beforeEach(module('florenceApp'));

  var QuestionsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    QuestionsComponent = $componentController('QuestionsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
