import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import * as Verify from '../verify';

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
    var state = parseState(req);
    console.log(state)
    User.findOne({'facebook.id': profile.id}, '-salt -password').exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }
         Verify.verify('facebook', profile, state.userId, state.token)
          .then(data => {
            if(data.user){
              return done(null, data.user, {});
            } else {
              var url = '/login/verify';
              if(data.vId && data.token){
                url += '?vId=' + data.vId + '&token=' + data.token;
              }
              return done(null, false, { redirect: url})
            }
          })
          .catch(err => { console.log(err) })
      })
      .catch(err => {
        console.log(err)
      });
  }));
}

function parseState(req){
  req.query = req.query || {};
  var state = {}
  if(req.query.state){
    try {
        state = JSON.parse(req.query.state);
    } catch (e) {
        console.log('Invalid state JSON.')
        return false
    }
    return state;
  } else {
    return false;
  }
}
