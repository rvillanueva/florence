'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var parseCtrlStub = {
  index: 'parseCtrl.index',
  show: 'parseCtrl.show',
  create: 'parseCtrl.create',
  update: 'parseCtrl.update',
  destroy: 'parseCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var parseIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './parse.controller': parseCtrlStub
});

describe('Parse API Router:', function() {

  it('should return an express router instance', function() {
    parseIndex.should.equal(routerStub);
  });

  describe('GET /api/parse', function() {

    it('should route to parse.controller.index', function() {
      routerStub.get
        .withArgs('/', 'parseCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/parse/:id', function() {

    it('should route to parse.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'parseCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/parse', function() {

    it('should route to parse.controller.create', function() {
      routerStub.post
        .withArgs('/', 'parseCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/parse/:id', function() {

    it('should route to parse.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'parseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/parse/:id', function() {

    it('should route to parse.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'parseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/parse/:id', function() {

    it('should route to parse.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'parseCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
