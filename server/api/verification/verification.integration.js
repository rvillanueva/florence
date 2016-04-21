'use strict';

var app = require('../..');
import request from 'supertest';

var newVerification;

describe('Verification API:', function() {

  describe('GET /api/verify', function() {
    var verifications;

    beforeEach(function(done) {
      request(app)
        .get('/api/verify')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          verifications = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      verifications.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/verify', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/verify')
        .send({
          name: 'New Verification',
          info: 'This is the brand new verification!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newVerification = res.body;
          done();
        });
    });

    it('should respond with the newly created verification', function() {
      newVerification.name.should.equal('New Verification');
      newVerification.info.should.equal('This is the brand new verification!!!');
    });

  });

  describe('GET /api/verify/:id', function() {
    var verification;

    beforeEach(function(done) {
      request(app)
        .get('/api/verify/' + newVerification._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          verification = res.body;
          done();
        });
    });

    afterEach(function() {
      verification = {};
    });

    it('should respond with the requested verification', function() {
      verification.name.should.equal('New Verification');
      verification.info.should.equal('This is the brand new verification!!!');
    });

  });

  describe('PUT /api/verify/:id', function() {
    var updatedVerification;

    beforeEach(function(done) {
      request(app)
        .put('/api/verify/' + newVerification._id)
        .send({
          name: 'Updated Verification',
          info: 'This is the updated verification!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedVerification = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedVerification = {};
    });

    it('should respond with the updated verification', function() {
      updatedVerification.name.should.equal('Updated Verification');
      updatedVerification.info.should.equal('This is the updated verification!!!');
    });

  });

  describe('DELETE /api/verify/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/verify/' + newVerification._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when verification does not exist', function(done) {
      request(app)
        .delete('/api/verify/' + newVerification._id)
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
