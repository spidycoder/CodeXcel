const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCPP = (filePath, input = "") => {
  const jobId = path.basename(filePath).split(".")[0];
  const output_fileName = `${jobId}.exe`;
  const outPath = path.join(outputPath, output_fileName);

  return new Promise((resolve, reject) => {
    const compile = spawn("g++", [filePath, "-o", outPath]);

    compile.on("exit", (code) => {
      if (code !== 0) {
        return reject(`Compilation failed with exit code ${code}`);
      }

      const run = spawn(outPath, [], { cwd: outputPath });

      let result = "";
      let error = "";

      run.stdin.write(input);
      run.stdin.end();

      run.stdout.on("data", (data) => {
        result += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      run.on("close", (code) => {
        if (code !== 0) {
          return reject(`Runtime Error:\n${error}`);
        }
        return resolve(result);
      });
    });

    compile.stderr.on("data", (data) => {
      reject(`Compilation Error:\n${data.toString()}`);
    });
  });
};

module.exports = { executeCPP };
