'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var aspectCtrlStub = {
  index: 'aspectCtrl.index',
  show: 'aspectCtrl.show',
  create: 'aspectCtrl.create',
  update: 'aspectCtrl.update',
  destroy: 'aspectCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var aspectIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './aspect.controller': aspectCtrlStub
});

describe('Aspect API Router:', function() {

  it('should return an express router instance', function() {
    aspectIndex.should.equal(routerStub);
  });

  describe('GET /api/aspects', function() {

    it('should route to aspect.controller.index', function() {
      routerStub.get
        .withArgs('/', 'aspectCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/aspects/:id', function() {

    it('should route to aspect.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'aspectCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/aspects', function() {

    it('should route to aspect.controller.create', function() {
      routerStub.post
        .withArgs('/', 'aspectCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/aspects/:id', function() {

    it('should route to aspect.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'aspectCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/aspects/:id', function() {

    it('should route to aspect.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'aspectCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/aspects/:id', function() {

    it('should route to aspect.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'aspectCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
