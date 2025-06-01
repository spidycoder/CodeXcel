const express = require("express");
const Problem = require("../models/Problem");
const router = express.Router();

router.put("/admin", async (req, res) => {
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

module.exports = router;
