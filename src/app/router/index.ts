import { Express } from 'express';
import { signup, signin } from '../controllers';
import passport from 'passport';

// as long as we use jwt, we do not need to use session. (uses local storage)
const requiredAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const router = (app: Express) => {
  // service page
  app.get('/', requiredAuth, (req, res) => {
    res.send({ hi: 'there' });
  });

  app.post('/signin', requireSignin, signin);
  app.post('/signup', signup);
}

export default router;