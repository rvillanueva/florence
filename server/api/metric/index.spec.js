'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var metricCtrlStub = {
  index: 'metricCtrl.index',
  show: 'metricCtrl.show',
  create: 'metricCtrl.create',
  update: 'metricCtrl.update',
  destroy: 'metricCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var metricIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './metric.controller': metricCtrlStub
});

describe('Metric API Router:', function() {

  it('should return an express router instance', function() {
    metricIndex.should.equal(routerStub);
  });

  describe('GET /api/metrics', function() {

    it('should route to metric.controller.index', function() {
      routerStub.get
        .withArgs('/', 'metricCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/metrics/:id', function() {

    it('should route to metric.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'metricCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/metrics', function() {

    it('should route to metric.controller.create', function() {
      routerStub.post
        .withArgs('/', 'metricCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/metrics/:id', function() {

    it('should route to metric.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'metricCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/metrics/:id', function() {

    it('should route to metric.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'metricCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/metrics/:id', function() {

    it('should route to metric.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'metricCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
