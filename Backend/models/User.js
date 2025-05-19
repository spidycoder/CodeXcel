const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
    required: true,
  },
  lastName: {
    type: String,
    default: null,
    required: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  collegeName: {
    type: String,
    default: null,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userschema);
