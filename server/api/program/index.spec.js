'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var programCtrlStub = {
  index: 'programCtrl.index',
  show: 'programCtrl.show',
  create: 'programCtrl.create',
  update: 'programCtrl.update',
  destroy: 'programCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var programIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './program.controller': programCtrlStub
});

describe('Program API Router:', function() {

  it('should return an express router instance', function() {
    programIndex.should.equal(routerStub);
  });

  describe('GET /api/programs', function() {

    it('should route to program.controller.index', function() {
      routerStub.get
        .withArgs('/', 'programCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/programs/:id', function() {

    it('should route to program.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'programCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/programs', function() {

    it('should route to program.controller.create', function() {
      routerStub.post
        .withArgs('/', 'programCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/programs/:id', function() {

    it('should route to program.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'programCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/programs/:id', function() {

    it('should route to program.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'programCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/programs/:id', function() {

    it('should route to program.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'programCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
