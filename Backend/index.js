const express = require("express");
const { DBConnection } = require("./database/db");
const User = require("./models/User");
const Problem = require("./models/Problem");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

DBConnection();

//routes
app.get("/", (req, res) => {
  res.status(200).send("Hello from Aadi Bhai");
});
app.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      collegeName,
      password,
      confirmPassword,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !collegeName ||
      !password ||
      !confirmPassword ||
      password.length < 8
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
      res.status(409).send("Email already exists");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({
      firstName,
      lastName,
      email,
      collegeName,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    user.token = token;
    user.password = hashedPassword;
    res.status(200).send("User registered Successfully");
    console.log(user);
  } catch (error) {
    console.error("Error while creating User", error);
  }
});
//login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("All fields are Required.");
    }
    // console.log("Email from backend: ", email);
    // console.log("Password from backend: ", password);
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (!existingUser) {
      res.status(400).send("Invalid Email");
    }
    if (!bcrypt.compareSync(password, existingUser.password)) {
      res.status(401).send("wrong password.");
    }
    res.status(200).send("User found successfully using Backend");
  } catch (error) {
    console.error("Error while logging in User", error);
  }
});
//contribte route
app.post("/contribute", async (req, res) => {
  try {
    const { problemName, description, difficulty, tags } = req.body;
    if (!problemName || !description || !difficulty || tags.length == 0) {
      res.status(401).send("All fields are required");
    }
    const existingProblem = await Problem.findOne({ problemName });
    if (existingProblem) {
      res.status(400).send("Problem Name Should be Unique.");
    }
    console.log("Problem Name from backend ", problemName);
    console.log("description from backend ", description);
    console.log("difficulty from backend ", difficulty);
    console.log("tags from backend ", tags);
    const problem = await Problem.create({
      problemName,
      description,
      difficulty,
      tags,
    });
    console.log(problem);
    res.status(200).send("Problem Contributed Successfully");
  } catch (error) {
    console.error("Error while creating problem", error);
  }
});
app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});

