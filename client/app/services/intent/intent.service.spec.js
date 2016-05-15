'use strict';

describe('Service: intent', function () {

  // load the service's module
  beforeEach(module('riverApp'));

  // instantiate service
  var intent;
  beforeEach(inject(function (_intent_) {
    intent = _intent_;
  }));

  it('should do something', function () {
    expect(!!intent).toBe(true);
  });

});
