'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var verificationCtrlStub = {
  index: 'verificationCtrl.index',
  show: 'verificationCtrl.show',
  create: 'verificationCtrl.create',
  update: 'verificationCtrl.update',
  destroy: 'verificationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var verificationIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './verification.controller': verificationCtrlStub
});

describe('Verification API Router:', function() {

  it('should return an express router instance', function() {
    verificationIndex.should.equal(routerStub);
  });

  describe('GET /api/verify', function() {

    it('should route to verification.controller.index', function() {
      routerStub.get
        .withArgs('/', 'verificationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/verify/:id', function() {

    it('should route to verification.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'verificationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/verify', function() {

    it('should route to verification.controller.create', function() {
      routerStub.post
        .withArgs('/', 'verificationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/verify/:id', function() {

    it('should route to verification.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'verificationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/verify/:id', function() {

    it('should route to verification.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'verificationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/verify/:id', function() {

    it('should route to verification.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'verificationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
