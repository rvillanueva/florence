'use strict';

describe('Filter: splitPrompt', function () {

  // load the filter's module
  beforeEach(module('florenceApp'));

  // initialize a new instance of the filter before each test
  var capitalize;
  beforeEach(inject(function ($filter) {
    capitalize = $filter('splitPrompt');
  }));

  it('should return the input prefixed with "capitalize filter:"', function () {
    var text = 'angularjs';
    expect(capitalize(text)).toBe('capitalize filter: ' + text);
  });

});
