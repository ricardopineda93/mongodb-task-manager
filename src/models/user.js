const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password'))
          throw new Error("Password cannot contain the word 'password'!");
      }
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!');
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be positive number!');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

// Creating a virtual field to help bridge associations from other collections,
// However this is not a 'real' field on the model.
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

// Hashing plaintext password before saving.
userSchema.pre('save', async function(next) {
  const user = this;

  // Handles hashing our user's password only if any adjustment has been made to the
  // password field, i.e. when it's being created or password is being reset, not every
  // single time an update is made otherwise the password would constantly be rehashed.
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Deleting user tasks when user is deleted.
userSchema.pre('remove', async function(next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

// Generating a JWT upon login... METHODS property signify this will be accessible
// as an INSTANCE method.
userSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, 'youathot');

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

// Generating a safer, publicly viewable object to return without sensitive data.
// We are highjacking the toJSON method going on behind the scenes in express for this
// custom behavior.
userSchema.methods.toJSON = function() {
  const user = this;

  // Turning instance in to a manipulable object...
  const userObject = user.toObject();

  // Deleting sensitive fields from that object...
  delete userObject.password;
  delete userObject.tokens;

  // Remove the avatar image from the response for speed and size.
  delete userObject.avatar;

  // Sending back censored user fields...
  return userObject;
};

// Attaching a login by credentials method onto the model.
// Statics property signify things that are availble on THE MODEL.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Couldn"t find any account with that email.');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password.');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
