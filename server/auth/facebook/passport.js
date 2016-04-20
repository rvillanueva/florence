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
    console.log('Calling back...')
    console.log(profile)
    req.query = req.query || {}
    var state = JSON.parse(req.query.state) || {};
    User.findOne({'facebook.id': profile.id}, '-salt -password').exec()
      .then(user => {
        console.log('user')
        console.log(user)
        console.log(state)

        if (!user) {
          if(!state.userId){
            console.log('No user id specified in query.')
            return done(null, false, {
              message: 'No user id specified in query.'
            }); // FIXME Handle error better.
          }
          User.findById(state.userId, '-salt -password').exec()
          .then(user => {
            if(!user){
              return done(null, false, {
                message: 'No user found with this id.'
              });
            } else {
              verifyFacebookAuth(user);
            }
          })
        } else {
          return done(null, user);
        }

        function verifyFacebookAuth(user){
          console.log('VERIFYING...')
          console.log(user)
          if(user.verify.token && user.verify.token == state.verifyToken){
            attachFacebookAuth(user)
          } else {
            user.verify.facebook = profile;
            Verify.generateVerifyToken(user._id)
            .then(tokenData => {
              Verify.sendVerification(user._id, tokenData.token)
              return done(null, false, {
                message: 'Verify on Messenger.'
                // FIXME Handle error better.
              });
            })
            .catch(err => done(err))
          }
        }
      })
      .catch(err => done(err));

      function attachFacebookAuth(user){
        if(profile.picture){
          user.picture = profile.picture;
        }
        if(!user.email){
          profile.emails[0].email;
        }
        user.facebook = profile._json;
        user.save()
        .then(user => done(null, user))
        .catch(err => done(err))
      }

  }));
}
