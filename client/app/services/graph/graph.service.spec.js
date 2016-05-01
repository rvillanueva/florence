'use strict';

describe('Service: Graph', function () {

  // load the service's module
  beforeEach(module('riverApp'));

  // instantiate service
  var graph;
  beforeEach(inject(function (_graph_) {
    graph = _graph_;
  }));

  it('should do something', function () {
    expect(!!graph).toBe(true);
  });

});
