'use strict';

describe('Service: Modals', function () {

  // load the service's module
  beforeEach(module('florenceApp'));

  // instantiate service
  var Modals;
  beforeEach(inject(function (_Modals_) {
    Modals = _Modals_;
  }));

  it('should do something', function () {
    expect(!!Modals).toBe(true);
  });

});
