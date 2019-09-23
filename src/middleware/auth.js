const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // Grabbing token from auth header and cleaning up hte string.
    const token = req.header('Authorization').replace('Bearer ', '');

    // Decoding the token value containing the field we chose to encode with our secret.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Finding the user from the field we just decoded from the token AND who has the
    // token in the user token array.
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    // If no user is found throw an error immediately.
    if (!user) throw new Error();

    // Attach the token to the req object for use throughout the app.
    req.token = token;

    // Otherwise, attach the validated user as a property on the req object for
    // access throughout the server.
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Error: Not authenticated.' });
  }
};

module.exports = auth;
