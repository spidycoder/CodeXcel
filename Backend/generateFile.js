const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
  fs.mkdirSync(dirCode, { recursive: true });
}

const generateFile = (language, code) => {
  const jobId = uuid();
  const fileName = `${jobId}.${language}`;
  const filePath = path.join(dirCode, fileName);
  fs.writeFileSync(filePath, code);
  return filePath;
};
module.exports = { generateFile };
