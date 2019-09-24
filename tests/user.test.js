const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Richie',
  email: 'ricardo@kinetik.care',
  password: '1234567',
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }]
};

// Clearing the DB before each test and seeding in one dummy user.
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Vanessa',
      email: 'vanessa@email.com',
      password: '1234567'
    })
    .expect(201);

  // Asserting the DB was correctly changed:
  const newUser = await User.findById(response.body.newUser._id);
  expect(newUser).not.toBeNull();

  // Assertion about the response:
  expect(response.body).toMatchObject({
    newUser: {
      name: 'Vanessa',
      email: 'vanessa@email.com'
    },
    token: newUser.tokens[0].token
  });

  // Testing password we recieved back from response to make sure it is NOT plaintext
  expect(newUser.password).not.toBe('1234567');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);

  // Validating token created for logged in user.
  const user = await User.findById(response.body.user._id);
  const secondUserToken = user.tokens[1].token;
  expect(response.body.token).toBe(secondUserToken);
});

test('Should NOT login non-existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: 'bad@email.com', password: 'badpass123' })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // Need to pass in auth header and token.
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete authenticated user account', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Ensuring the user is in fact deleted from the DB:
  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test('Should NOT delete unauthenticated user account', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should update valid user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ email: 'richie@email.com' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.email).toBe('richie@email.com');
});

test('Should NOT update INVALID user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: '110 Wall Street' })
    .expect(400);
});

// Testing for file uploads

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/meme.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  // The .toEqual method is an algorithm that tests for equality in properties
  // rather than the typical === operator. .toBe() uses === equality so be aware of this
  // when to use what.
  expect(user.avatar).toEqual(expect.any(Buffer));
  // The expect.any() assertion accepts a constructor funtion so that we can evaluate types
});
