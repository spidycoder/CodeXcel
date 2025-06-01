const express = require("express");
const { aiCodeReview } = require("../aiCodeReview");

const router = express.Router();

router.post("/ai-review", async (req, res) => {
  const { code } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
    // console.log("Code Received for AI Review", code);
    // console.log("AI Code Review Requested");
    const review = await aiCodeReview(code);
    // console.log("AI Review", review);
    res.json({ review: review });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error in AI review, error: " + error.message });
  }
});

module.exports = router;
