import { NextFunction, Request, Response } from 'express';
import { CallbackError, Error } from 'mongoose';
import User from '../models/';

export const authentication = (req: Request, res: Response, next: NextFunction) => {

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(422).send({ err: 'You must provide email and password' });
  }


  User.findOne({ email }, (err: CallbackError, existingUser: {email: string, password: string}) => {
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

      res.json({ success: true });
    });
  });
}