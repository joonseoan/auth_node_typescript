import passport from 'passport';
import User, { UserSchema } from '../models';
import { Config } from '../config/config';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { CallbackError, Model, Schema } from 'mongoose';
import { Strategy as LocalStrategy } from 'passport-local';

export interface JwtPayload {
  // userId defined in jwt encode
  sub: string;
  iat: number; 
};

// ----------------------- Login Strategy ------------------
const localLogin = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {

    User.findOne({ email }, (err: CallbackError, user: Model<UserSchema>) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        // can't find user --> login fail
        return done(null, false);
      }

      // user.comparePassword(password, function() {

      // });

    });

});





// --------------------------- After Signup --------------
const jwtOptions = {
  // look at the header in request from client!
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // decode jwt with the key.
  secretOrKey: Config.secret,
};

// [Important]
// After analyzing JWT from header, JWT is decoded into "payload" below.!!
const jwtLogin = new JwtStrategy(jwtOptions, function(payload: JwtPayload, done) {
  User.findById(payload.sub, function(err: CallbackError, user: UserSchema) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      // user found
      done(null, user);
    } else {
      // user not found ---> unauthorized
      done(null, false);
    }
  });
});

passport.use(jwtLogin);