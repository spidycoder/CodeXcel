const express = require("express");
const Problem = require("../models/Problem");
const User = require("../models/User");
const router = express.Router();

// GET /recommendations/by-problem/:problemName
router.get('/recommendations/by-problem/:problemName', async (req, res) => {
    try {
        const currentProblem = await Problem.findOne({ problemName: req.params.problemName });
        if (!currentProblem) {
            return res.status(404).send("Problem not found");
        }

        // Find other problems with at least one matching tag or same difficulty
        const similarProblems = await Problem.find({
            problemName: { $ne: currentProblem.problemName }, // Exclude current problem
            $or: [
                { tags: { $in: currentProblem.tags } },
                { difficulty: currentProblem.difficulty }
            ]
        }).limit(5);

        return res.status(200).json(similarProblems);
    } catch (error) {
        console.error("Error while fetching recommendations", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;