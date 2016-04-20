'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
import * as Verify from '../../verify';
var Promise = require('bluebird');
var router = express.Router();

router
  .get('/', function(req, res) {
    var options = {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login',
      session: false
    }
    if (req.query) {
      var state = {
        userId: req.query.userId,
        verifyToken: req.query.verifyToken
      }
      options.state = JSON.stringify(state);
    } else {
      options.state = JSON.stringify({})
    }
    passport.authenticate('facebook', options)(req, res);
  })
  .get('/callback', function(req, res, next) {
    passport.authenticate('facebook', {
      failureRedirect: '/login',
      session: false
    })(req, res, next)
  }, setTokenCookie)
  .get('/verify', function(req, res, next) {
    Verify.verify(req.query.userId, req.query.token)
    .then(res => {
      res.status(200).send('Verified!');
    })
    .catch(err => res.status(err.statusCode).end())
  });

export default router;
