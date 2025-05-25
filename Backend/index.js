const express = require("express");
const { DBConnection } = require("./database/db");
const User = require("./models/User");
const Problem = require("./models/Problem");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCPP } = require("./executeCPP");
const { executePython } = require("./executePython");
const { executeJS } = require("./executeJS");
const { generateInputFile } = require("./generateInputFile");
const { executeJava } = require("./executeJava");

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
      password.length < 5
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
    // console.log(existingProblem);
    res.status(200).send(existingProblem);
  } catch (error) {
    console.error("Error While Finding the Problem", error);
    res.status(500).send("Server Error");
  }
});
//route to find the problem by name for the admin's page.
app.get("/admin", async (req, res) => {
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
//route to delete problems
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
//route to find the problems
app.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).send(problems);
  } catch (error) {
    console.error("Error while fetching problem", error);
    return res.status(500).send("Interal Server Error");
  }
});
//route to find problem by name
app.get("/problems/:problemName", async (req, res) => {
  try {
    //here params is used to fetch the details from url
    const { problemName } = req.params;

    const existingProblem = await Problem.findOne({ problemName });

    if (!existingProblem) {
      return res.status(404).send("No problem found");
    }

    res.status(200).send(existingProblem);
  } catch (error) {
    console.error("Error while fetching problem using problemName", error);
    return res.status(500).send("Internal Server Error");
  }
});
//route to find the user find the userName
app.get("/users/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    const existingUser = await User.findOne({ userName });
    if (!existingUser) {
      res.status(404).send("User not found");
    }
    res.status(200).send(existingUser);
  } catch (error) {
    console.error("Error while fetching problem using problemName", error);
    return res.status(500).send("Internal Server Error");
  }
});
//api for running the code
app.post("/run", async (req, res) => {
  try {
    const { input, problemName, language, code } = req.body;
    // console.log("for Running the Code");
    // console.log("Input received in backend", input);
    // console.log("Size of Input", input.length);
    // console.log("problemName received in backend", problemName);
    // console.log("language received in backend", language);
    // console.log("code received in backend", code);
    if (input.length == 0) {
      return res.status(400).send("Fill the input");
    }
    if (problemName === "") {
      return res.status(401).send("problem name is not defined");
    }
    if (language === undefined)
      return res.status(402).send("Choose the language");
    if (code === undefined)
      return res.status(403).send("Write the complete code");
    const filePath = generateFile(language, code);
    const inputPath = generateInputFile(input);
    let result;
    if (language === "cpp") {
      result = await executeCPP(filePath, input);
    } else if (language === "py") {
      result = await executePython(filePath, inputPath);
    } else if (language === "java") {
      result = await executeJava(filePath, inputPath);
    } else if (language === "js") {
      result = await executeJS(filePath, inputPath);
    }
    // console.log("Output received for the Problem", result);
    if (!result.success) return res.status(405).send(result.error);
    return res.status(200).json({
      output: result.output,
    });
  } catch (error) {
    console.error("Error while running the code", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/submit", async (req, res) => {
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
          verdict: "Compilation/Runtime Error",
        });
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

    if (allPassed) {
      const problem = {
        problemName,
        difficulty: existingProblem.difficulty,
        language,
        code,
      };
      existingUser.problemsSolved.push(problem);
      await existingUser.save();
    }

    // console.log("Result of Submission", results);
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error while running the code", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
