'use strict';

var app = require('../..');
import request from 'supertest';

var newIntent;

describe('Intent API:', function() {

  describe('GET /api/intents', function() {
    var intents;

    beforeEach(function(done) {
      request(app)
        .get('/api/intents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          intents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      intents.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/intents', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/intents')
        .send({
          name: 'New Intent',
          info: 'This is the brand new intent!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newIntent = res.body;
          done();
        });
    });

    it('should respond with the newly created intent', function() {
      newIntent.name.should.equal('New Intent');
      newIntent.info.should.equal('This is the brand new intent!!!');
    });

  });

  describe('GET /api/intents/:id', function() {
    var intent;

    beforeEach(function(done) {
      request(app)
        .get('/api/intents/' + newIntent._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          intent = res.body;
          done();
        });
    });

    afterEach(function() {
      intent = {};
    });

    it('should respond with the requested intent', function() {
      intent.name.should.equal('New Intent');
      intent.info.should.equal('This is the brand new intent!!!');
    });

  });

  describe('PUT /api/intents/:id', function() {
    var updatedIntent;

    beforeEach(function(done) {
      request(app)
        .put('/api/intents/' + newIntent._id)
        .send({
          name: 'Updated Intent',
          info: 'This is the updated intent!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedIntent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedIntent = {};
    });

    it('should respond with the updated intent', function() {
      updatedIntent.name.should.equal('Updated Intent');
      updatedIntent.info.should.equal('This is the updated intent!!!');
    });

  });

  describe('DELETE /api/intents/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/intents/' + newIntent._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when intent does not exist', function(done) {
      request(app)
        .delete('/api/intents/' + newIntent._id)
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
