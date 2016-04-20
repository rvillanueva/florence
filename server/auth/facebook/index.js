'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
var Promise = require('bluebird');
var router = express.Router();

router
  .get('/', passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login',
      session: false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false
  }), setTokenCookie);

export default router;
