'use strict';

var app = require('../..');
import request from 'supertest';

var newMetric;

describe('Metric API:', function() {

  describe('GET /api/metrics', function() {
    var metrics;

    beforeEach(function(done) {
      request(app)
        .get('/api/metrics')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          metrics = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      metrics.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/metrics', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/metrics')
        .send({
          name: 'New Metric',
          info: 'This is the brand new metric!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMetric = res.body;
          done();
        });
    });

    it('should respond with the newly created metric', function() {
      newMetric.name.should.equal('New Metric');
      newMetric.info.should.equal('This is the brand new metric!!!');
    });

  });

  describe('GET /api/metrics/:id', function() {
    var metric;

    beforeEach(function(done) {
      request(app)
        .get('/api/metrics/' + newMetric._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          metric = res.body;
          done();
        });
    });

    afterEach(function() {
      metric = {};
    });

    it('should respond with the requested metric', function() {
      metric.name.should.equal('New Metric');
      metric.info.should.equal('This is the brand new metric!!!');
    });

  });

  describe('PUT /api/metrics/:id', function() {
    var updatedMetric;

    beforeEach(function(done) {
      request(app)
        .put('/api/metrics/' + newMetric._id)
        .send({
          name: 'Updated Metric',
          info: 'This is the updated metric!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMetric = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMetric = {};
    });

    it('should respond with the updated metric', function() {
      updatedMetric.name.should.equal('Updated Metric');
      updatedMetric.info.should.equal('This is the updated metric!!!');
    });

  });

  describe('DELETE /api/metrics/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/metrics/' + newMetric._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when metric does not exist', function(done) {
      request(app)
        .delete('/api/metrics/' + newMetric._id)
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
