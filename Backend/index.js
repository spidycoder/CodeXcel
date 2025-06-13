const express = require("express");
const { DBConnection } = require("./database/db");
const cors = require("cors");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const contributeRoute = require("./routes/contribute");
const problemByNameRoute = require("./routes/problemByName");
const problemByNameForAdminRouter = require("./routes/problemByNameForAdmin");
const updateProblemRoute = require("./routes/updateProblem");
const deleteProblemRoute = require("./routes/deleteProblem");
const findProblemRoute = require("./routes/findProblem");
const solvedProblemOfUserRoute = require("./routes/solvedProblemOfUser");
const profileOfUserRoute = require("./routes/profileOfUser");
const runCodeRoute = require("./routes/runCode");
const submitCodeRoute = require("./routes/submitCode");
const submissionsRoute = require("./routes/submissionsRoute");
const aiCodeReviewRoute = require("./routes/aireview");
const leaderboardRoute = require("./routes/leaderboard");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

DBConnection();

//routes
app.get("/", (req, res) => {
  res.status(200).send("Hello from Aditya Singh");
});
//register route
app.use("/", registerRoute);
//login route
app.use("/", loginRoute);
//contribte route
app.use("/", contributeRoute);
//route to find the problem by name for the problems page.
app.use("/", problemByNameRoute);
//route to find the problem by name for the admin's page.
app.use("/", problemByNameForAdminRouter);
//route to update the problem from admin's page.
app.use("/", updateProblemRoute);
//route to delete problems.
app.use("/", deleteProblemRoute);
//route to find the problems.
app.use("/", findProblemRoute);
//route to find all the solved problems of a user.
app.use("/", solvedProblemOfUserRoute);
//route to find the profile of userName.
app.use("/", profileOfUserRoute);
//api for running the code.
app.use("/", runCodeRoute);
//api for submitting the code.
app.use("/", submitCodeRoute);  
//route to find the user's submissions for a problem
app.use("/", submissionsRoute);
//route for AI reveiw
app.use("/", aiCodeReviewRoute);
//route to get the leaderBoard.
app.use("/", leaderboardRoute);

app.listen(PORT || 8000, () => {
  console.log("Server is running on port 8000");
});
