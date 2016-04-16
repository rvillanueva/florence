'use strict';

var app = require('../..');
import request from 'supertest';

var newValue;

describe('Value API:', function() {

  describe('GET /api/values', function() {
    var values;

    beforeEach(function(done) {
      request(app)
        .get('/api/values')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          values = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      values.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/values', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/values')
        .send({
          name: 'New Value',
          info: 'This is the brand new value!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newValue = res.body;
          done();
        });
    });

    it('should respond with the newly created value', function() {
      newValue.name.should.equal('New Value');
      newValue.info.should.equal('This is the brand new value!!!');
    });

  });

  describe('GET /api/values/:id', function() {
    var value;

    beforeEach(function(done) {
      request(app)
        .get('/api/values/' + newValue._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          value = res.body;
          done();
        });
    });

    afterEach(function() {
      value = {};
    });

    it('should respond with the requested value', function() {
      value.name.should.equal('New Value');
      value.info.should.equal('This is the brand new value!!!');
    });

  });

  describe('PUT /api/values/:id', function() {
    var updatedValue;

    beforeEach(function(done) {
      request(app)
        .put('/api/values/' + newValue._id)
        .send({
          name: 'Updated Value',
          info: 'This is the updated value!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedValue = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedValue = {};
    });

    it('should respond with the updated value', function() {
      updatedValue.name.should.equal('Updated Value');
      updatedValue.info.should.equal('This is the updated value!!!');
    });

  });

  describe('DELETE /api/values/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/values/' + newValue._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when value does not exist', function(done) {
      request(app)
        .delete('/api/values/' + newValue._id)
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
