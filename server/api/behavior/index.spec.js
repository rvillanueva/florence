'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var behaviorCtrlStub = {
  index: 'behaviorCtrl.index',
  show: 'behaviorCtrl.show',
  create: 'behaviorCtrl.create',
  update: 'behaviorCtrl.update',
  destroy: 'behaviorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var behaviorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './behavior.controller': behaviorCtrlStub
});

describe('Behavior API Router:', function() {

  it('should return an express router instance', function() {
    behaviorIndex.should.equal(routerStub);
  });

  describe('GET /api/behaviors', function() {

    it('should route to behavior.controller.index', function() {
      routerStub.get
        .withArgs('/', 'behaviorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/behaviors/:id', function() {

    it('should route to behavior.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'behaviorCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/behaviors', function() {

    it('should route to behavior.controller.create', function() {
      routerStub.post
        .withArgs('/', 'behaviorCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/behaviors/:id', function() {

    it('should route to behavior.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'behaviorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/behaviors/:id', function() {

    it('should route to behavior.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'behaviorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/behaviors/:id', function() {

    it('should route to behavior.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'behaviorCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
