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
    req.query = req.query || {};
    var state = {};
    if(req.query.state){
      try {
          state = JSON.parse(req.query.state);
      } catch (e) {
          console.log('Invalid state JSON.')
      }
    }

    User.findOne({'facebook.id': profile.id}, '-salt -password').exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }

        if(!state.userId){
          return done(null, false, {
            message: 'To complete authentication, you need to connect with Messenger...',
            redirect: '/login/start'
          });
        }
         Verify.checkVerification(state.userId, state.token)
          .then(user => {
            if(!user){
              return Verify.createVerification('facebook', profile, state.userId);
            }
            return done(null, user);
          })
          .then(verification => { return done(null, false, { redirect: '/login/sent' }); })
          .catch(err => { return done(null, false, err) })
      })
      .catch(err => {
        return done(null, false, err)
      });
  }));
}
