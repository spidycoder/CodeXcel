const mongoose = require("mongoose");
const problemSchema = new mongoose.Schema(
  {
    problemName: {
      type: String,
      required: false,
    },
    difficulty: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    verdict: {
      type: String,
      required: false,
      default: "Pending",
    },
  },
  { timestamps: true },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
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
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  problemsContributed: {
    type: Number,
    required: false,
    default: 0,
  },
  problemsSolved: {
    type: [problemSchema],
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
