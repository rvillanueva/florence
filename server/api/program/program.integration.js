'use strict';

var app = require('../..');
import request from 'supertest';

var newProgram;

describe('Program API:', function() {

  describe('GET /api/programs', function() {
    var programs;

    beforeEach(function(done) {
      request(app)
        .get('/api/programs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          programs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      programs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/programs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/programs')
        .send({
          name: 'New Program',
          info: 'This is the brand new program!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProgram = res.body;
          done();
        });
    });

    it('should respond with the newly created program', function() {
      newProgram.name.should.equal('New Program');
      newProgram.info.should.equal('This is the brand new program!!!');
    });

  });

  describe('GET /api/programs/:id', function() {
    var program;

    beforeEach(function(done) {
      request(app)
        .get('/api/programs/' + newProgram._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          program = res.body;
          done();
        });
    });

    afterEach(function() {
      program = {};
    });

    it('should respond with the requested program', function() {
      program.name.should.equal('New Program');
      program.info.should.equal('This is the brand new program!!!');
    });

  });

  describe('PUT /api/programs/:id', function() {
    var updatedProgram;

    beforeEach(function(done) {
      request(app)
        .put('/api/programs/' + newProgram._id)
        .send({
          name: 'Updated Program',
          info: 'This is the updated program!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProgram = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProgram = {};
    });

    it('should respond with the updated program', function() {
      updatedProgram.name.should.equal('Updated Program');
      updatedProgram.info.should.equal('This is the updated program!!!');
    });

  });

  describe('DELETE /api/programs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/programs/' + newProgram._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when program does not exist', function(done) {
      request(app)
        .delete('/api/programs/' + newProgram._id)
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
