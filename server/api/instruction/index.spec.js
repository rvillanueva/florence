'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var instructionCtrlStub = {
  index: 'instructionCtrl.index',
  show: 'instructionCtrl.show',
  create: 'instructionCtrl.create',
  update: 'instructionCtrl.update',
  destroy: 'instructionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var instructionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './instruction.controller': instructionCtrlStub
});

describe('Instruction API Router:', function() {

  it('should return an express router instance', function() {
    instructionIndex.should.equal(routerStub);
  });

  describe('GET /api/instructions', function() {

    it('should route to instruction.controller.index', function() {
      routerStub.get
        .withArgs('/', 'instructionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/instructions/:id', function() {

    it('should route to instruction.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'instructionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/instructions', function() {

    it('should route to instruction.controller.create', function() {
      routerStub.post
        .withArgs('/', 'instructionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/instructions/:id', function() {

    it('should route to instruction.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'instructionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/instructions/:id', function() {

    it('should route to instruction.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'instructionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/instructions/:id', function() {

    it('should route to instruction.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'instructionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
