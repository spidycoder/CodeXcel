const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URL;
const DBConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("Error while connecting the database", error);
  }
};
module.exports = { DBConnection };
