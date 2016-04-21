import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import * as Verify from '../../components/verify';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails'
    ],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done){
    console.log('Calling back...');
    console.log(profile);
    req.query = req.query || {}
    var state = JSON.parse(req.query.state) || {};
    var userId = state.userId;
    User.findOne({'facebook.id': profile.id}, '-salt -password').exec()
      .then(user => {
        if (!user) {
          console.log('No user found, creating verification...');
          Verify.createVerification('facebook', profile, userId)
          .then(sent => {
            return done(null, sent);
          })
          .catch(err => {
            return done(null, false, err);
          })
        } else {
          return done(null, user);
        }
      })
      .catch(err => {
        return done(null, false, err)
      });
  }));
}
