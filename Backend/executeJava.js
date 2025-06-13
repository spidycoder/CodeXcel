const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const TIME_LIMIT = 5000; // 2 seconds

const executeJava = (filePath, inputFile) => {
  return new Promise((resolve) => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const className = fileName.split(".")[0];

    const compileCommand = `javac ${filePath}`;
    const runCommand = `java -cp ${dir} ${className} < ${inputFile}`;

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        return resolve({
          success: false,
          error: `Compilation Error:\n${compileStderr || compileErr.message}`,
        });
      }

      // Run with timeout
      exec(
        runCommand,
        { timeout: TIME_LIMIT, shell: true },
        (runErr, stdout, runStderr) => {
          if (runErr) {
            // Time Limit Exceeded Case
            if (runErr.killed && runErr.signal === "SIGTERM") {
              return resolve({
                success: false,
                error: `Time Limit Exceeded.Please Optimise Your Code`,
              });
            }

            // Other Runtime Errors
            return resolve({
              success: false,
              error: `Runtime Error:\n${runStderr || runErr.message}`,
            });
          }

          // Successful execution
          return resolve({
            success: true,
            output: stdout,
          });
        }
      );
    });
  });
};

module.exports = { executeJava };
