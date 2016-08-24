'use strict';

var app = require('../..');
import request from 'supertest';

var newConversation;

describe('Twilio API:', function() {

  describe('GET /api/twilio', function() {
    var conversations;

    beforeEach(function(done) {
      request(app)
        .get('/api/conversation')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          conversations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      conversations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/conversation', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/conversation')
        .send({
          name: 'New Conversation',
          info: 'This is the brand new conversation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newConversation = res.body;
          done();
        });
    });

    it('should respond with the newly created conversation', function() {
      newConversation.name.should.equal('New Conversation');
      newConversation.info.should.equal('This is the brand new conversation!!!');
    });

  });

  describe('GET /api/conversation/:id', function() {
    var conversation;

    beforeEach(function(done) {
      request(app)
        .get('/api/conversation/' + newConversation._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          conversation = res.body;
          done();
        });
    });

    afterEach(function() {
      conversation = {};
    });

    it('should respond with the requested conversation', function() {
      conversation.name.should.equal('New Conversation');
      conversation.info.should.equal('This is the brand new conversation!!!');
    });

  });

  describe('PUT /api/conversation/:id', function() {
    var updatedConversation;

    beforeEach(function(done) {
      request(app)
        .put('/api/conversation/' + newConversation._id)
        .send({
          name: 'Updated Conversation',
          info: 'This is the updated conversation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedConversation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedConversation = {};
    });

    it('should respond with the updated conversation', function() {
      updatedConversation.name.should.equal('Updated Conversation');
      updatedConversation.info.should.equal('This is the updated conversation!!!');
    });

  });

  describe('DELETE /api/conversation/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/conversation/' + newConversation._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when conversation does not exist', function(done) {
      request(app)
        .delete('/api/conversation/' + newConversation._id)
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
