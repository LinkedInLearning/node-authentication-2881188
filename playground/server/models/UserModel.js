// First we have to bring in mongoose
const mongoose = require('mongoose');
const crypto = require('crypto');

// Here we define the schema for our users
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true, // trim preceding spaces and trailing whitespaces
      index: { unique: true }, // the username should be unique
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      trim: true, // trim preceding spaces and trailing whitespaces
      lowercase: true, // normalize email addresses to lowercase
      index: { unique: true }, // the email address needs to be unique
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // A password needs to be at least 8 characters long
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => crypto.randomBytes(20).toString('hex'),
    },
  },
  {
    timestamps: true,
  }
);

// We export the model `User` from the `UserSchema`
module.exports = mongoose.model('User', userSchema);
