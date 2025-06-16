const express = require("express");
const Problem = require("../models/Problem");
const User = require("../models/User");
const router = express.Router();

router.delete("/delete", async (req, res) => {
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

    const existingUser = await User.findOne({ userName });

    // Delete the problem
    await Problem.deleteOne({ problemName: problemNameOfForm });

    // Update user's problemsContributed
    existingUser.problemsContributed = existingUser.problemsContributed - 1;
    if(existingUser.problemsContributed<=0){
      existingUser.problemsContributed=0;
    }
    // Remove from problemsSolved if present
    if (
      existingUser.problemsSolved.some(
        (p) => p.problemName === problemNameOfForm
      )
    ) {
      existingUser.problemsSolved = existingUser.problemsSolved.filter(
        (problem) => problem.problemName !== problemNameOfForm
      );
    }

    await existingUser.save();

    res.status(200).send("Problem deleted successfully");
  } catch (error) {
    console.error("Error while deleting the problem", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
