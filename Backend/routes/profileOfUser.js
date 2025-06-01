const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/profile/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    // console.log("UserName received in backend", userName);
    const existingUser = await User.findOne({ userName });
    if (!existingUser) {
      res.status(404).send("User not found");
    }
    res.status(200).send(existingUser);
  } catch (error) {
    console.error("Error while fetching problem using problemName", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
