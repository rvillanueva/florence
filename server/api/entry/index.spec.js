'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var entryCtrlStub = {
  index: 'entryCtrl.index',
  show: 'entryCtrl.show',
  create: 'entryCtrl.create',
  update: 'entryCtrl.update',
  destroy: 'entryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var entryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './entry.controller': entryCtrlStub
});

describe('Entry API Router:', function() {

  it('should return an express router instance', function() {
    entryIndex.should.equal(routerStub);
  });

  describe('GET /api/entries', function() {

    it('should route to entry.controller.index', function() {
      routerStub.get
        .withArgs('/', 'entryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/entries/:id', function() {

    it('should route to entry.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'entryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/entries', function() {

    it('should route to entry.controller.create', function() {
      routerStub.post
        .withArgs('/', 'entryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/entries/:id', function() {

    it('should route to entry.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'entryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/entries/:id', function() {

    it('should route to entry.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'entryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/entries/:id', function() {

    it('should route to entry.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'entryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
