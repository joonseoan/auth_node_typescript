import request from 'supertest';
import { app } from '../app/index';

describe('Test', () => {
  it('should have status 401 for unauthorized request', (done) => {
    request(app)
      .get('/')
      .set('authorization', '')
      .expect(401)
      .end(done)
  })
});