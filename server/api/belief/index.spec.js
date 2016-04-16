'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var beliefCtrlStub = {
  index: 'beliefCtrl.index',
  show: 'beliefCtrl.show',
  create: 'beliefCtrl.create',
  update: 'beliefCtrl.update',
  destroy: 'beliefCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var beliefIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './belief.controller': beliefCtrlStub
});

describe('Belief API Router:', function() {

  it('should return an express router instance', function() {
    beliefIndex.should.equal(routerStub);
  });

  describe('GET /api/belief', function() {

    it('should route to belief.controller.index', function() {
      routerStub.get
        .withArgs('/', 'beliefCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/belief/:id', function() {

    it('should route to belief.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'beliefCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/belief', function() {

    it('should route to belief.controller.create', function() {
      routerStub.post
        .withArgs('/', 'beliefCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/belief/:id', function() {

    it('should route to belief.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'beliefCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/belief/:id', function() {

    it('should route to belief.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'beliefCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/belief/:id', function() {

    it('should route to belief.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'beliefCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
