import jwt from 'jwt-simple';
import { NextFunction, Request, Response } from 'express';
import { CallbackError } from 'mongoose';

import User, { UserSchema } from '../models/';
import { Config } from '../config/config';

function tokenForUser (user: UserSchema) {
  return jwt.encode({
      sub: user._id,
      iat: new Date().getTime() 
    },
    Config.secret,
  );
};

export const signup = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(422).send({ err: 'You must provide email and password' });
  }

  User.findOne({ email }, (err: CallbackError, existingUser: UserSchema) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      // unprocessible entity
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({
      email,
      password,
    });

    user.save((err: CallbackError) => {
      if(err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user) });
    });
  });
};

export const signin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res.send({ token: tokenForUser(req.user as UserSchema) });
  } else {
    res.send({ errorMessage: 'something is wrong.' });
  }
};