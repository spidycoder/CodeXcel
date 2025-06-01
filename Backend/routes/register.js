const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      collegeName,
      password,
      confirmPassword,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !collegeName ||
      !password ||
      !confirmPassword ||
      password.length < 5
    ) {
      return res.status(400).json({
        message:
          "Please fill all the required fields and password should be at least 8 characters long.",
      });
    }

    if (confirmPassword !== password) {
      return res.status(401).json({
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already exists");
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(410).send("UserName already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      collegeName,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      userName: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      collegeName: user.collegeName,
    });
    console.log("User registered successfully", res.data);
  } catch (error) {
    console.error("Error while creating User", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

