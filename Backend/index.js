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

//login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are Required.");
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
//contribte route
app.post("/contribute", async (req, res) => {
  try {
    const {
      problemName,
      description,
      authorName,
      difficulty,
      tags,
      constraints,
      testCases,
    } = req.body;
    if (
      !problemName ||
      !description ||
      !authorName ||
      !difficulty ||
      tags.length == 0 ||
      !constraints ||
      testCases.length == 0
    ) {
      res.status(401).send("All fields are required");
    }
    const existingProblem = await Problem.findOne({ problemName });
    if (existingProblem) {
      res.status(400).send("Problem Name Should be Unique.");
    }
    // console.log("Problem Name from backend ", problemName);
    // console.log("description from backend ", description);
    // console.log("authorName from backend ", authorName);
    // console.log("difficulty from backend ", difficulty);
    // console.log("tags from backend ", tags);
    // console.log("Constraints from backend ", constraints);
    // console.log("TestCases from backend ", testCases);
    const problem = await Problem.create({
      problemName,
      description,
      authorName,
      difficulty,
      tags,
      constraints,
      testCases,
    });
    // console.log(problem);
    res.status(200).send("Problem Contributed Successfully");
  } catch (error) {
    console.error("Error while creating problem", error);
  }
});
//route to find the problem by name for the problems page.
app.get("/problems/:problemName", async (req, res) => {
  try {
    const { problemName } = req.params;
    const existingProblem = await Problem.findOne({ problemName });
    if (!existingProblem) {
      return res
        .status(404)
        .send("Problem does not Exists,Write the correct name.");
    }
    console.log(existingProblem);
    res.status(200).send(existingProblem);
  } catch (error) {
    console.error("Error While Finding the Problem", error);
    res.status(500).send("Server Error");
  }
});
//route to find the problem by name for the admin's page.
app.post("/admin", async (req, res) => {
  try {
    const { problemName, userInfo } = req.body;
    const existingProblem = await Problem.findOne({ problemName });
    if (!existingProblem) {
      return res
        .status(404)
        .send("Problem does not Exists,Write the correct name.");
    }
    // console.log(existingProblem);
    res.status(200).send(existingProblem);
  } catch (error) {
    console.error("Error While Finding the Problem", error);
    res.status(500).send("Server Error");
  }
});
//route to update the problem from admin's page
app.put("/admin", async (req, res) => {
  try {
    const { problemInfo, userInfo, problemNameOfForm } = req.body;
    const { userName } = userInfo;

    const { formData, tags, testCases } = problemInfo;
    const { problemName, description, authorName, difficulty, constraints } =
      formData;

    const problemNameFromFrontend = problemName;
    const descriptionFromFrontend = description;
    const authorNameFromFrontend = authorName;
    const difficultyFromFrontend = difficulty;
    const tagsFromFrontend = tags;
    const constraintsFromFrontend = constraints;
    const testCasesFromFrontend = testCases;
    const existingProblem = await Problem.findOne({
      problemName: problemNameOfForm,
    });
    if (!existingProblem) {
      return res.status(404).send("Problem not found");
    }
    // console.log("Existing Problem from Backend", existingProblem);

    // Authorization check: only author or admin can update
    if (existingProblem.authorName !== userName && userName !== "Spidycoder") {
      return res.status(401).send("Unauthorized to update this problem.");
    }

    // Use findOneAndUpdate to update and return the updated document
    const updatedProblem = await Problem.findOneAndUpdate(
      { problemName: problemNameOfForm }, // filter
      {
        $set: {
          problemName: problemNameFromFrontend,
          description: descriptionFromFrontend,
          authorName: authorNameFromFrontend,
          difficulty: difficultyFromFrontend,
          tags: tagsFromFrontend,
          constraints: constraintsFromFrontend,
          testCases: testCasesFromFrontend,
        },
      },
      { new: true } // this ensures the returned document is the updated one
    );
    // console.log("Updated Problem from backend", updatedProblem);
    res.status(200).json("Problem Updated Successfully");
  } catch (error) {
    console.error("Error While Updating the Problem", error);
    res.status(500).send("Server Error");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const { userInfo, problemNameOfForm } = req.body;
    const { userName } = userInfo;

    const existingProblem = await Problem.findOne({
      problemName: problemNameOfForm,
    });

    if (!existingProblem) {
      return res.status(404).send("Problem not found");
    }

    if (existingProblem.authorName !== userName && userName !== "Spidycoder") {
      return res.status(401).send("Unauthorized to delete this problem.");
    }

    await Problem.deleteOne({ problemName: problemNameOfForm });

    res.status(200).send("Problem deleted successfully");
  } catch (error) {
    console.error("Error while deleting the problem", error);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
