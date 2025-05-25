const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const executeJS = (filePath, inputFile) => {
  return new Promise((resolve) => {
    const command = `node ${filePath} < ${inputFile}`;
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error || stderr) {
        return resolve({
          success: false,
          error: `Runtime Error:\n${stderr || error.message}`,
        });
      }

      return resolve({
        success: true,
        output: stdout,
      });
    });
  });
};
module.exports = { executeJS };