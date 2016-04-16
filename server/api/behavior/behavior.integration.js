'use strict';

var app = require('../..');
import request from 'supertest';

var newBehavior;

describe('Behavior API:', function() {

  describe('GET /api/behaviors', function() {
    var behaviors;

    beforeEach(function(done) {
      request(app)
        .get('/api/behaviors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          behaviors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      behaviors.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/behaviors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/behaviors')
        .send({
          name: 'New Behavior',
          info: 'This is the brand new behavior!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBehavior = res.body;
          done();
        });
    });

    it('should respond with the newly created behavior', function() {
      newBehavior.name.should.equal('New Behavior');
      newBehavior.info.should.equal('This is the brand new behavior!!!');
    });

  });

  describe('GET /api/behaviors/:id', function() {
    var behavior;

    beforeEach(function(done) {
      request(app)
        .get('/api/behaviors/' + newBehavior._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          behavior = res.body;
          done();
        });
    });

    afterEach(function() {
      behavior = {};
    });

    it('should respond with the requested behavior', function() {
      behavior.name.should.equal('New Behavior');
      behavior.info.should.equal('This is the brand new behavior!!!');
    });

  });

  describe('PUT /api/behaviors/:id', function() {
    var updatedBehavior;

    beforeEach(function(done) {
      request(app)
        .put('/api/behaviors/' + newBehavior._id)
        .send({
          name: 'Updated Behavior',
          info: 'This is the updated behavior!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBehavior = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBehavior = {};
    });

    it('should respond with the updated behavior', function() {
      updatedBehavior.name.should.equal('Updated Behavior');
      updatedBehavior.info.should.equal('This is the updated behavior!!!');
    });

  });

  describe('DELETE /api/behaviors/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/behaviors/' + newBehavior._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when behavior does not exist', function(done) {
      request(app)
        .delete('/api/behaviors/' + newBehavior._id)
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
