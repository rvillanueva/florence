'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
var router = express.Router();

router
  .get('/', function(req, res) {
    var options = {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login',
      session: false,
      state: {}
    }
    if (req.query && req.query.userId) {
      options.state = JSON.stringify({
        userId: req.query.userId
      });
    }
    passport.authenticate('facebook', options)(req, res);
  })
  .get('/callback', passport.authenticate('facebook', {
      failureRedirect: '/login',
      session: false
    }), setTokenCookie);

export default router;
