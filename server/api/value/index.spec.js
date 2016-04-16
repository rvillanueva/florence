'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var valueCtrlStub = {
  index: 'valueCtrl.index',
  show: 'valueCtrl.show',
  create: 'valueCtrl.create',
  update: 'valueCtrl.update',
  destroy: 'valueCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var valueIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './value.controller': valueCtrlStub
});

describe('Value API Router:', function() {

  it('should return an express router instance', function() {
    valueIndex.should.equal(routerStub);
  });

  describe('GET /api/values', function() {

    it('should route to value.controller.index', function() {
      routerStub.get
        .withArgs('/', 'valueCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/values/:id', function() {

    it('should route to value.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'valueCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/values', function() {

    it('should route to value.controller.create', function() {
      routerStub.post
        .withArgs('/', 'valueCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/values/:id', function() {

    it('should route to value.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'valueCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/values/:id', function() {

    it('should route to value.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'valueCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/values/:id', function() {

    it('should route to value.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'valueCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
