'use strict';

var app = require('../..');
import request from 'supertest';

var newBelief;

describe('Belief API:', function() {

  describe('GET /api/belief', function() {
    var beliefs;

    beforeEach(function(done) {
      request(app)
        .get('/api/belief')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          beliefs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      beliefs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/belief', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/belief')
        .send({
          name: 'New Belief',
          info: 'This is the brand new belief!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBelief = res.body;
          done();
        });
    });

    it('should respond with the newly created belief', function() {
      newBelief.name.should.equal('New Belief');
      newBelief.info.should.equal('This is the brand new belief!!!');
    });

  });

  describe('GET /api/belief/:id', function() {
    var belief;

    beforeEach(function(done) {
      request(app)
        .get('/api/belief/' + newBelief._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          belief = res.body;
          done();
        });
    });

    afterEach(function() {
      belief = {};
    });

    it('should respond with the requested belief', function() {
      belief.name.should.equal('New Belief');
      belief.info.should.equal('This is the brand new belief!!!');
    });

  });

  describe('PUT /api/belief/:id', function() {
    var updatedBelief;

    beforeEach(function(done) {
      request(app)
        .put('/api/belief/' + newBelief._id)
        .send({
          name: 'Updated Belief',
          info: 'This is the updated belief!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBelief = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBelief = {};
    });

    it('should respond with the updated belief', function() {
      updatedBelief.name.should.equal('Updated Belief');
      updatedBelief.info.should.equal('This is the updated belief!!!');
    });

  });

  describe('DELETE /api/belief/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/belief/' + newBelief._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when belief does not exist', function(done) {
      request(app)
        .delete('/api/belief/' + newBelief._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
