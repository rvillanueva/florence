'use strict';

var app = require('../..');
import request from 'supertest';

var newOutcome;

describe('Outcome API:', function() {

  describe('GET /api/outcome', function() {
    var outcomes;

    beforeEach(function(done) {
      request(app)
        .get('/api/outcome')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          outcomes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      outcomes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/outcome', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/outcome')
        .send({
          name: 'New Outcome',
          info: 'This is the brand new outcome!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newOutcome = res.body;
          done();
        });
    });

    it('should respond with the newly created outcome', function() {
      newOutcome.name.should.equal('New Outcome');
      newOutcome.info.should.equal('This is the brand new outcome!!!');
    });

  });

  describe('GET /api/outcome/:id', function() {
    var outcome;

    beforeEach(function(done) {
      request(app)
        .get('/api/outcome/' + newOutcome._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          outcome = res.body;
          done();
        });
    });

    afterEach(function() {
      outcome = {};
    });

    it('should respond with the requested outcome', function() {
      outcome.name.should.equal('New Outcome');
      outcome.info.should.equal('This is the brand new outcome!!!');
    });

  });

  describe('PUT /api/outcome/:id', function() {
    var updatedOutcome;

    beforeEach(function(done) {
      request(app)
        .put('/api/outcome/' + newOutcome._id)
        .send({
          name: 'Updated Outcome',
          info: 'This is the updated outcome!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOutcome = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOutcome = {};
    });

    it('should respond with the updated outcome', function() {
      updatedOutcome.name.should.equal('Updated Outcome');
      updatedOutcome.info.should.equal('This is the updated outcome!!!');
    });

  });

  describe('DELETE /api/outcome/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/outcome/' + newOutcome._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when outcome does not exist', function(done) {
      request(app)
        .delete('/api/outcome/' + newOutcome._id)
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
