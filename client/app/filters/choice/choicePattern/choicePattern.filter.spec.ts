'use strict';

describe('Filter: choicePattern', function () {

  // load the filter's module
  beforeEach(module('florenceApp'));

  // initialize a new instance of the filter before each test
  var responseShortname;
  beforeEach(inject(function ($filter) {
    responseShortname = $filter('responseShortname');
  }));

  it('should return the input prefixed with "responseShortname filter:"', function () {
    var text = 'angularjs';
    expect(responseShortname(text)).toBe('responseShortname filter: ' + text);
  });

});
