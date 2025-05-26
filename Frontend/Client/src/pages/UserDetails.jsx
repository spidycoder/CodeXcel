import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userDetails, setUserDetails] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    if (!user || !user.userName) return;

    axios
      .get(`http://localhost:8000/users/${user.userName}`)
      .then((res) => {
        setUserDetails(res.data);

        const uniqueProblemsMap = new Map();
        res.data.problemsSolved.forEach((problem) => {
          if (!uniqueProblemsMap.has(problem.problemName)) {
            uniqueProblemsMap.set(problem.problemName, problem);
          }
        });

        setProblems(Array.from(uniqueProblemsMap.values()));
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, [user]);

  // Difficulty count for bar chart
  const difficultyCount = {
    Easy: problems.filter(p => p.difficulty === "Easy").length,
    Medium: problems.filter(p => p.difficulty === "Medium").length,
    Hard: problems.filter(p => p.difficulty === "Hard").length,
  };

  const barChartData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Problems Solved",
        data: [difficultyCount.Easy, difficultyCount.Medium, difficultyCount.Hard],
        backgroundColor: ["#34D399", "#FBBF24", "#EF4444"]
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Problems Solved by Difficulty" }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg font-medium">
        No user logged in.
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg font-medium">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h2 className="text-3xl font-extrabold text-gray-900 border-b-4 border-indigo-600 pb-3">
        User Details
      </h2>

      {/* User Info Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Username:</span> {userDetails.userName}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">First Name:</span> {userDetails.firstName}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Last Name:</span> {userDetails.lastName}
          </p>
        </div>
        <div>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Email:</span> {userDetails.email}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">College:</span> {userDetails.collegeName}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Problems Contributed:</span>{" "}
            {userDetails.problemsContributed || 0}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      {/* Problems Solved */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          Problems Solved
        </h3>

        {problems.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200 text-gray-800">
              <thead className="bg-indigo-50 text-indigo-700 uppercase text-sm font-semibold tracking-wide">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 text-left">
                    Problem Name
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr
                    key={index}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-3 border-b border-gray-200">
                      <Link
                        to={`/problems/${problem.problemName}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {problem.problemName}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No problems solved yet.</p>
        )}
      </section>
    </div>
  );
};

export default UserDetails;
