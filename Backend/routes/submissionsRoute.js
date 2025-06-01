const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/submissions", async (req, res) => {
  try {
    const { problemName, userName } = req.body;
    if (!problemName) {
      return res.status(401).send("Problem name is not defined");
    }
    if (!userName) {
      return res.status(402).send("User name is not defined");
    }
    const existingUser = await User.findOne({ userName });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }
    const submissions = existingUser.problemsSolved.filter(
      (problem) => problem.problemName === problemName
    );
    // submissions.find().sort({ createdAt: -1 });
    res.status(200).json({ submissions });
  } catch (error) {
    console.error("Error while fetching problem using problemName", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
