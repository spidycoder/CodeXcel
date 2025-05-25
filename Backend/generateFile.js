const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
  fs.mkdirSync(dirCode, { recursive: true });
}

const generateFile = (language, code) => {
  let fileName;
  //Java requires the public class name and file name to match
  if (language === "java") {
    fileName = `Main.java`;
  } else {
    const jobId = uuid();
    fileName = `${jobId}.${language}`;
  }
  const filePath = path.join(dirCode, fileName);
  fs.writeFileSync(filePath, code);
  return filePath;
};
module.exports = { generateFile };
