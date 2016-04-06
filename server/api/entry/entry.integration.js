'use strict';

var app = require('../..');
import request from 'supertest';

var newEntry;

describe('Entry API:', function() {

  describe('GET /api/entries', function() {
    var entrys;

    beforeEach(function(done) {
      request(app)
        .get('/api/entries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          entrys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      entrys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/entries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/entries')
        .send({
          name: 'New Entry',
          info: 'This is the brand new entry!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEntry = res.body;
          done();
        });
    });

    it('should respond with the newly created entry', function() {
      newEntry.name.should.equal('New Entry');
      newEntry.info.should.equal('This is the brand new entry!!!');
    });

  });

  describe('GET /api/entries/:id', function() {
    var entry;

    beforeEach(function(done) {
      request(app)
        .get('/api/entries/' + newEntry._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          entry = res.body;
          done();
        });
    });

    afterEach(function() {
      entry = {};
    });

    it('should respond with the requested entry', function() {
      entry.name.should.equal('New Entry');
      entry.info.should.equal('This is the brand new entry!!!');
    });

  });

  describe('PUT /api/entries/:id', function() {
    var updatedEntry;

    beforeEach(function(done) {
      request(app)
        .put('/api/entries/' + newEntry._id)
        .send({
          name: 'Updated Entry',
          info: 'This is the updated entry!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEntry = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEntry = {};
    });

    it('should respond with the updated entry', function() {
      updatedEntry.name.should.equal('Updated Entry');
      updatedEntry.info.should.equal('This is the updated entry!!!');
    });

  });

  describe('DELETE /api/entries/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/entries/' + newEntry._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when entry does not exist', function(done) {
      request(app)
        .delete('/api/entries/' + newEntry._id)
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
