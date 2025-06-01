const express = require("express");
const User = require("../models/User");
const Problem = require("../models/Problem");
const router = express.Router();

router.post("/contribute", async (req, res) => {
  try {
    const {
      problemName,
      description,
      authorName,
      difficulty,
      tags,
      constraints,
      testCases,
      userName,
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
    const existingUser = await User.findOne({ userName });
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
    existingUser.problemsContributed = existingUser.problemsContributed + 1;
    await existingUser.save();
    // console.log(problem);
    res.status(200).send("Problem Contributed Successfully");
  } catch (error) {
    console.error("Error while creating problem", error);
  }
});

module.exports = router;
