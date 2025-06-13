const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const TIME_LIMIT = 2000; // 2 seconds

const executePython = (filePath, inputFile) => {
  return new Promise((resolve) => {
    const input = fs.readFileSync(inputFile, "utf8");

    const run = spawn("python", [filePath]);

    let output = "";
    let errorOutput = "";
    let isTLE = false;

    // Handle input
    run.stdin.write(input);
    run.stdin.end();

    // Set timeout
    const timeout = setTimeout(() => {
      isTLE = true;
      run.kill("SIGKILL");
    }, TIME_LIMIT);

    run.stdout.on("data", (data) => {
      output += data.toString();
    });

    run.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    run.on("close", (code) => {
      clearTimeout(timeout);

      if (isTLE) {
        return resolve({
          success: false,
          error: `Time Limit Exceeded.Please Optimise Your Code.`,
        });
      }

      if (code !== 0 && errorOutput.includes("SyntaxError")) {
        return resolve({
          success: false,
          error: `Compilation Error:\n${errorOutput}`,
        });
      }

      if (code !== 0 || errorOutput) {
        return resolve({
          success: false,
          error: `Runtime Error:\n${errorOutput}`,
        });
      }

      return resolve({
        success: true,
        output,
      });
    });
  });
};

module.exports = { executePython };
