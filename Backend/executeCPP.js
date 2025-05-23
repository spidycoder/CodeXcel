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

    let compileError = "";

    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    compile.on("exit", (code) => {
      if (code !== 0) {
        return resolve({
          success: false,
          error: `Compilation Error:\n${compileError}`,
        });
      }

      const run = spawn(outPath, [], { cwd: outputPath });

      let output = "";
      let runtimeError = "";

      // 💡 Safely pass multiline input
      run.stdin.write(input, "utf-8", () => {
        run.stdin.end();
      });

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        runtimeError += data.toString();
      });

      run.on("close", (code) => {
        if (code !== 0 || runtimeError) {
          return resolve({
            success: false,
            error: `Runtime Error:\n${runtimeError}`,
          });
        }

        return resolve({
          success: true,
          output,
        });
      });
    });
  });
};

module.exports = { executeCPP };
