const express = require("express");
const Problem = require("../models/Problem");
const router = express.Router();

router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).send(problems);
  } catch (error) {
    console.error("Error while fetching problem", error);
    return res.status(500).send("Interal Server Error");
  }
});

module.exports = router;