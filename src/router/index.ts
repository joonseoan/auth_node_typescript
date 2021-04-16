import { Express } from 'express';
import { authentication } from '../controllers';

const router = (app: Express) => {
  app.post('/signup', authentication);
}

export default router;