'use strict';

var app = require('../..');
import request from 'supertest';

var newAspect;

describe('Aspect API:', function() {

  describe('GET /api/aspects', function() {
    var aspects;

    beforeEach(function(done) {
      request(app)
        .get('/api/aspects')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          aspects = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      aspects.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/aspects', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/aspects')
        .send({
          name: 'New Aspect',
          info: 'This is the brand new aspect!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAspect = res.body;
          done();
        });
    });

    it('should respond with the newly created aspect', function() {
      newAspect.name.should.equal('New Aspect');
      newAspect.info.should.equal('This is the brand new aspect!!!');
    });

  });

  describe('GET /api/aspects/:id', function() {
    var aspect;

    beforeEach(function(done) {
      request(app)
        .get('/api/aspects/' + newAspect._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          aspect = res.body;
          done();
        });
    });

    afterEach(function() {
      aspect = {};
    });

    it('should respond with the requested aspect', function() {
      aspect.name.should.equal('New Aspect');
      aspect.info.should.equal('This is the brand new aspect!!!');
    });

  });

  describe('PUT /api/aspects/:id', function() {
    var updatedAspect;

    beforeEach(function(done) {
      request(app)
        .put('/api/aspects/' + newAspect._id)
        .send({
          name: 'Updated Aspect',
          info: 'This is the updated aspect!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAspect = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAspect = {};
    });

    it('should respond with the updated aspect', function() {
      updatedAspect.name.should.equal('Updated Aspect');
      updatedAspect.info.should.equal('This is the updated aspect!!!');
    });

  });

  describe('DELETE /api/aspects/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/aspects/' + newAspect._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when aspect does not exist', function(done) {
      request(app)
        .delete('/api/aspects/' + newAspect._id)
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
