const express = require("express");
const { executeCPP } = require("../executeCPP");
const { executePython } = require("../executePython");
const { executeJava } = require("../executeJava");
const { executeJS } = require("../executeJS");
const { generateFile } = require("../generateFile");
const { generateInputFile } = require("../generateInputFile");
const User = require("../models/User");
const Problem = require("../models/Problem");
const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { language, code, problemName, userName } = req.body;

    // console.log("Language for Submit in backend", language);
    // console.log("Code for Submit in backend", code);
    // console.log("Problem Name for Submit in backend", problemName);
    // console.log("UserName in Submit from backend", userName);

    if (!problemName) {
      return res.status(401).send("Problem name is not defined");
    }
    if (!language) {
      return res.status(402).send("Choose the language");
    }
    if (!code) {
      return res.status(403).send("Write the complete code");
    }

    const existingProblem = await Problem.findOne({ problemName });
    if (!existingProblem) {
      return res.status(404).send("Problem not found");
    }

    const testCases = existingProblem.testCases;
    // console.log("TestCases for the problem", testCases);
    const filePath = generateFile(language, code);
    const results = [];
    let codeError = "Wrong Answer";
    for (let i = 0; i < testCases.length; i++) {
      const testInput = testCases[i].input;
      const expectedOutput = testCases[i].output;

      // console.log("Input for Submission", testInput);
      // console.log("Expected Output for Submission", expectedOutput);
      const inputFile = generateInputFile(testInput);
      // console.log("Input file for Submission", inputFile);
      let result;
      if (language === "cpp") {
        result = await executeCPP(filePath, testInput);
      } else if (language === "py") {
        result = await executePython(filePath, inputFile);
      } else if (language === "java") {
        result = await executeJava(filePath, inputFile);
      } else if (language === "js") {
        result = await executeJS(filePath, inputFile);
      }
      // console.log("Result for above testCase", result);
      // console.log("Output received for Submission", result.output);

      if (!result.success) {
        results.push({
          input: testInput,
          success: false,
          error: result.error,
          expectedOutput,
          receivedOutput: null,
          verdict: result.error,
        });
        codeError = result.error;
        continue;
      }

      /*
        To make the comparison robust, normalize both outputs by:
          1. Splitting them into lines
          2. Trimming each line
          3. Removing empty lines
          4. Comparing line by line
      */
      const normalize = (text) =>
        text
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n");

      const receivedOutput = normalize(result.output);
      const expectedTrimmed = normalize(expectedOutput);

      // console.log("Expected Normalized Output", expectedTrimmed);
      // console.log("Received Normalized Output output", receivedOutput);

      const passed = receivedOutput === expectedTrimmed;
      if (passed) {
        codeError = result.error;
      } else {
        codeError = "Wrong Answer";
      }
      results.push({
        input: testInput,
        expectedOutput: expectedTrimmed,
        receivedOutput,
        success: true,
        verdict: passed ? "Accepted" : "Wrong Answer",
      });
    }

    const existingUser = await User.findOne({ userName });
    if (!existingUser) {
      return res.status(405).send("User not found");
    }

    const allPassed = results.every((result) => result.verdict === "Accepted");

    const problem = {
      problemName,
      difficulty: existingProblem.difficulty,
      language,
      code,
      verdict: allPassed ? "Accepted" : codeError,
    };
    const alreadySolved = existingUser.problemsSolved.find(
      (p) =>
        p.problemName === existingProblem.problemName &&
        p.verdict === "Accepted"
    );
    // console.log("Already Solved", alreadySolved);
    // console.log("Already Solved or not ", alreadySolved);
    if (allPassed && alreadySolved === undefined) {
      // console.log("First Time Solving");
      // console.log("prev Score", existingUser.score);
      if (existingProblem.difficulty == "Easy") {
        existingUser.score += 5;
      } else if (existingProblem.difficulty === "Medium") {
        existingUser.score += 10;
      } else {
        existingUser.score += 15;
      }
      existingUser.problemsSolved.push(problem);
      // console.log("Current Score", existingUser.score);
    }
    // console.log("Score of User", existingUser.score);
    await existingUser.save();

    // console.log("Result of Submission", results);
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error while running the code", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
