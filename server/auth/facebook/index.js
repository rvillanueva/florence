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
  .get('/callback', function(req, res){
    passport.authenticate('facebook', function(err, user, info) {
      var url = '/login';
      if(user){
        return setTokenCookie(user);
      } else if(info.redirect){
        url = info.redirect;
      }
      return res.redirect(url);
    })(req, res)
  });

export default router;
