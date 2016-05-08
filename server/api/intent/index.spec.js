'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var intentCtrlStub = {
  index: 'intentCtrl.index',
  show: 'intentCtrl.show',
  create: 'intentCtrl.create',
  update: 'intentCtrl.update',
  destroy: 'intentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var intentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './intent.controller': intentCtrlStub
});

describe('Intent API Router:', function() {

  it('should return an express router instance', function() {
    intentIndex.should.equal(routerStub);
  });

  describe('GET /api/intents', function() {

    it('should route to intent.controller.index', function() {
      routerStub.get
        .withArgs('/', 'intentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/intents/:id', function() {

    it('should route to intent.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'intentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/intents', function() {

    it('should route to intent.controller.create', function() {
      routerStub.post
        .withArgs('/', 'intentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/intents/:id', function() {

    it('should route to intent.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'intentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/intents/:id', function() {

    it('should route to intent.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'intentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/intents/:id', function() {

    it('should route to intent.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'intentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
