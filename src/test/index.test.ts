import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';

// const request = require('supertest');
// const { app } = require('../app/index');
// import { app } from '../app/index';

describe('Test', () => {

  it('should have status 401 for unauthorized request', (done) => {
    console.log('ddd')
    request(app)
      .get('/')
      .set('authorization', '')
      .expect(401)
      .end(done)
  });
});

beforeAll(done => {
  done()
})

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  await mongoose.connection.close();
  done()
})

