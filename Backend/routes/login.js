const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Email", email);
    // console.log("Pass", password);
    if (!email || !password) {
      return res.status(400).send("All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send("Invalid Email");
    }

    const isMatch = bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).send("Wrong password.");
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      userName: existingUser.userName,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      collegeName: existingUser.collegeName,
    });
  } catch (error) {
    console.error("Error while logging in User", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
