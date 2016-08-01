'use strict';

var app = require('../..');
import request from 'supertest';

var newParse;

describe('Parse API:', function() {

  describe('GET /api/parse', function() {
    var parses;

    beforeEach(function(done) {
      request(app)
        .get('/api/parse')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          parses = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      parses.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/parse', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/parse')
        .send({
          name: 'New Parse',
          info: 'This is the brand new parse!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newParse = res.body;
          done();
        });
    });

    it('should respond with the newly created parse', function() {
      newParse.name.should.equal('New Parse');
      newParse.info.should.equal('This is the brand new parse!!!');
    });

  });

  describe('GET /api/parse/:id', function() {
    var parse;

    beforeEach(function(done) {
      request(app)
        .get('/api/parse/' + newParse._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          parse = res.body;
          done();
        });
    });

    afterEach(function() {
      parse = {};
    });

    it('should respond with the requested parse', function() {
      parse.name.should.equal('New Parse');
      parse.info.should.equal('This is the brand new parse!!!');
    });

  });

  describe('PUT /api/parse/:id', function() {
    var updatedParse;

    beforeEach(function(done) {
      request(app)
        .put('/api/parse/' + newParse._id)
        .send({
          name: 'Updated Parse',
          info: 'This is the updated parse!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedParse = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedParse = {};
    });

    it('should respond with the updated parse', function() {
      updatedParse.name.should.equal('Updated Parse');
      updatedParse.info.should.equal('This is the updated parse!!!');
    });

  });

  describe('DELETE /api/parse/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/parse/' + newParse._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when parse does not exist', function(done) {
      request(app)
        .delete('/api/parse/' + newParse._id)
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
