import { Express } from 'express';
import { signup } from '../controllers';
import passport from 'passport';

// as long as we use jwt, we do not need to use session. (uses local storage)
const requiredAuth = passport.authenticate('jwt', { session: false });

const router = (app: Express) => {
  app.get('/', requiredAuth, (req, res) => {
    res.send({ hi: 'there' });
  });

  app.post('/signup', signup);
}

export default router;