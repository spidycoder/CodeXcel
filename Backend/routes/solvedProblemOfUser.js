const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { userName } = req.body;
    const existingUser = await User.findOne({ userName });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }
    const solved = [];
    for (let problem of existingUser.problemsSolved) {
      if (problem.verdict === "Accepted") {
      solved.push(problem.problemName);
    }
  }
    // console.log("Solved Questions from Backend",solved);
    return res.status(200).json(solved);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
