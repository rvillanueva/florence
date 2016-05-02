'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var conversationCtrlStub = {
  index: 'conversationCtrl.index',
  show: 'conversationCtrl.show',
  create: 'conversationCtrl.create',
  update: 'conversationCtrl.update',
  destroy: 'conversationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var conversationIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './conversation.controller': conversationCtrlStub
});

describe('Conversation API Router:', function() {

  it('should return an express router instance', function() {
    conversationIndex.should.equal(routerStub);
  });

  describe('GET /api/conversations', function() {

    it('should route to conversation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'conversationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/conversations/:id', function() {

    it('should route to conversation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'conversationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/conversations', function() {

    it('should route to conversation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'conversationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/conversations/:id', function() {

    it('should route to conversation.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'conversationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/conversations/:id', function() {

    it('should route to conversation.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'conversationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/conversations/:id', function() {

    it('should route to conversation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'conversationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
