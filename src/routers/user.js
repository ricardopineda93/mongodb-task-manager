const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// router.get('/users/:id', auth, async (req, res) => {
//   const _id = req.params.id; //Mongoose allows us NOT to have to convert this to ObjectID object.

//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.sendStatus(404);
//     res.send(user);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// });

router.post('/users', async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res.status(201).send({ newUser, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    // Removing the current Token
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    // Removes ALL tokens associated with user.
    req.user.tokens = [];
    await req.user.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidToUpdate = updates.every(field =>
    allowedUpdates.includes(field)
  );

  if (!isValidToUpdate)
    return res.status(400).send('Error: Invalid updates attempted.');

  try {
    // We need to do it this way in order to NOT bypass the middleware defined in the model.
    // const user = await User.findById(req.params.id);
    // updates.forEach(field => (user[field] = req.body[field]));
    // await user.save();
    // if (!user) return res.sendStatus(404);

    updates.forEach(field => (req.user[field] = req.body[field]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    // Getting the user _id from the req object and passing it in here.
    // const deletedUser = await User.findByIdAndDelete(req.user._id);
    // if (!deletedUser) return res.sendStatus(404);

    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
