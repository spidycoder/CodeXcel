const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const userDetails = await User.find();

    const performance = userDetails
      .map((user) => ({
        score: user.score,
        userName: user.userName,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((user, index) => {
        const rankEmoji = ["🥇", "🥈", "🥉"][index] || `🏅${index + 1}`;
        return {
          rank: rankEmoji,
          userName: user.userName,
          score: `🎯 ${user.score}`,
          solved: `✅ ${user.solved}`,
        };
      });

    const contributions = userDetails
      .map((user) => ({
        contributions: user.problemsContributed,
        userName: user.userName,
      }))
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 5)
      .map((user, index) => {
        const rankEmoji = ["🥇", "🥈", "🥉"][index] || `🏅${index + 1}`;
        return {
          rank: rankEmoji,
          userName: user.userName,
          contributions: `🧠 ${user.contributions}`,
        };
      });

    return res.status(200).send({ performance, contributions });
  } catch (error) {
    console.error("Error while fetching the leaderboard:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
