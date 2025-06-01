const express = require("express");
const Problem = require("../models/Problem");
const router = express.Router();

router.get("/admin", async (req, res) => {
  try {
    const { problemName, userInfo } = req.query;
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

module.exports = router;
