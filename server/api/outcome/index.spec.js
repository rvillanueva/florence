'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var outcomeCtrlStub = {
  index: 'outcomeCtrl.index',
  show: 'outcomeCtrl.show',
  create: 'outcomeCtrl.create',
  update: 'outcomeCtrl.update',
  destroy: 'outcomeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var outcomeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './outcome.controller': outcomeCtrlStub
});

describe('Outcome API Router:', function() {

  it('should return an express router instance', function() {
    outcomeIndex.should.equal(routerStub);
  });

  describe('GET /api/outcome', function() {

    it('should route to outcome.controller.index', function() {
      routerStub.get
        .withArgs('/', 'outcomeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/outcome/:id', function() {

    it('should route to outcome.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'outcomeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/outcome', function() {

    it('should route to outcome.controller.create', function() {
      routerStub.post
        .withArgs('/', 'outcomeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/outcome/:id', function() {

    it('should route to outcome.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'outcomeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/outcome/:id', function() {

    it('should route to outcome.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'outcomeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/outcome/:id', function() {

    it('should route to outcome.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'outcomeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
