import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jwt-simple';

import { app } from '../app';
import { Config } from '../app/config/config';
import User from '../app/models';

const mongoURI = 'mongodb+srv://joon:1111@cluster0.bffbk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

describe('Test', () => {

  let token: string;
  const tempUser = {
    email: 'a@afa.ca',
    password: 'abcde',
  };

  const tempUser2 = {
    email: 'c@a.ca',
    password: 'abcde',
  };

  beforeAll(async (done) => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
    });

    request(app)
      .post('/signup')
      .send(tempUser)
      .end((err, response) => {
        token = response.body.token;
        done();
      })
  });
  
  afterAll(async (done) => {
    await User.deleteMany();
    await mongoose.connection.close();
    done();
  });

  it('should have status 401 for unauthorized request', (done) => {
    request(app)
      .get('/')
      .set('authorization', '')
      .expect(401)
      .end(done)
  });

  it('should have status 401 for invalid token', (done) => {

    const userId = mongoose.Types.ObjectId();
    const invalidToken = jwt.encode({
        sub: userId,
        iat: new Date().getTime() 
      },
      Config.secret,
    );

    request(app)
      .get('/')
      .set('authorization', invalidToken)
      .expect(401)
      .end(done)
  });

  it('should have status 200 for invalid token', async () => {
    const response = await request(app)
      .get('/')
      .set('authorization', token)
      .expect(200)
    
      expect(response.body).toEqual({hi: 'there'});
  });

  it('should not make the user login with invalid email', async () => {

    const invalidUser = {
      email: 'b@afa.ca',
      password: 'abcde',
    };
    
    const response = await request(app)
    .post('/signin')
    .send(invalidUser)
    .expect(401)
  
  });

  it('should not make the user login with invalid password', async () => {

    const invalidUser = {
      email: 'a@afa.ca',
      password: 'abcdee',
    };
    
    const response = await request(app)
    .post('/signin')
    .send(invalidUser)
    .expect(401)
  
  });

  it('should make the user login', async () => {
    const response = await request(app)
    .post('/signin')
    .send(tempUser)
    .expect(200)
  
    expect(response.body.token).not.toBeFalsy();
  });

  it('should not make the same user signup', async () => {
    const response = await request(app)
    .post('/signup')
    .send(tempUser)
    .expect(422)
  });

  it('should not make the same user signup', async () => {
    const response = await request(app)
    .post('/signup')
    .send(tempUser)
    .expect(422)
  });

  it('should make the user signup', async (done) => {
    const response = await request(app)
    .post('/signup')
    .send(tempUser2)
    .expect(200)

    expect(response.body.token).not.toBeFalsy();
    const user = await User.findOne({ email: tempUser2.email });
    expect(user).not.toBeNull();
    done();
  });
});

