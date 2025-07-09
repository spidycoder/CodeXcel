const express = require("express");
const { executeCPP } = require("../executeCPP");
const { executePython } = require("../executePython");
const { executeJava } = require("../executeJava");
const { executeJS } = require("../executeJS");
const {generateFile} = require("../generateFile");
const {generateInputFile} = require("../generateInputFile");
const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { input, problemName, language, code } = req.body;
    // console.log("for Running the Code");
    // console.log("Input received in backend", input);
    // console.log("Size of Input", input.length);
    // console.log("problemName received in backend", problemName);
    // console.log("language received in backend", language);
    // console.log("code received in backend", code);

    // if (!input || input.trim().length === 0) {
    //   return res.status(400).send("Fill the input");
    // }
    if (!problemName || problemName.trim() === "") {
      return res.status(401).send("problem name is not defined");
    }
    if (!language) {
      return res.status(402).send("Choose the language");
    }
    if (!code || code.trim() === "") {
      return res.status(403).send("Write the complete code");
    }

    const filePath = generateFile(language, code);
    // console.log("filePath", filePath);
    const inputPath = generateInputFile(input);
    // console.log("Input Path", inputPath);
    let result;

    if (language === "cpp") {
      result = await executeCPP(filePath, input);
    } else if (language === "py") {
      result = await executePython(filePath, inputPath);
    } else if (language === "java") {
      result = await executeJava(filePath, inputPath);
    } else if (language === "js") {
      result = await executeJS(filePath, inputPath);
    } else {
      return res.status(402).send("Unsupported language");
    }

    // console.log("Output received for the Problem", result);
    if (!result.success) return res.status(405).send(result.error);

    return res.status(200).json({
      output: result.output,
    });
  } catch (error) {
    console.error("Error while running the code", error);
    res.status(500).send(error);
  }
});

module.exports = router;
