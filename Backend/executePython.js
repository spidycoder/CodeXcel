const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executePython = (filePath, inputFile) => {
  return new Promise((resolve) => {
    const command = `python ${filePath} < ${inputFile}`;
    //here,we are taking the input from shell that's why we are using shell:true 
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          success: false,
          error: `Compilation Error:\n${stderr || error.message}`,
        });
      }

      if (stderr) {
        return resolve({
          success: false,
          error: `Runtime Error:\n${stderr}`,
        });
      }

      return resolve({
        success: true,
        output: stdout,
      });
    });
  });
};

module.exports = { executePython };