const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputFile) => {
  return new Promise((resolve) => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const className = fileName.split(".")[0];
    const compileCommand = `javac ${filePath}`;
    const runCommand = `java -cp ${dir} ${className} < ${inputFile}`;
    exec(compileCommand, (compileError, _, compileStderr) => {
      if (compileError || compileStderr) {
        return resolve({
          success: false,
          error: `Compilation Error:\n${compileStderr || compileErr.message}`,
        });
      }
      //run
      exec(runCommand, { shell: true }, (runErr, stdout, runStderr) => {
        if (runErr || runStderr) {
          return resolve({
            sucess: false,
            error: `Runtime Error:\n${runStderr || runErr.message}`,
          });
        }
        return resolve({
          success: true,
          output: stdout,
        });
      });
    });
  });
};
module.exports = { executeJava };
