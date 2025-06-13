import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserDetails = () => {
  const { userName } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userDetails, setUserDetails] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    if (!user || !user.userName) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/profile/${userName}`)
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

  const difficultyCount = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  const barChartData = {
    labels: ["Easy 🟢", "Medium 🟡", "Hard 🔴"],
    datasets: [
      {
        label: "Problems Solved",
        data: [
          difficultyCount.Easy,
          difficultyCount.Medium,
          difficultyCount.Hard,
        ],
        backgroundColor: ["#6EE7B7", "#FCD34D", "#F87171"],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "📊 Problems Solved by Difficulty",
        font: { size: 18 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg font-medium">
        🚫 No user logged in.
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg font-medium">
        ⏳ Loading user details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h2 className="text-4xl font-extrabold text-gray-900 pb-3 flex items-center gap-2">
        Welcome to the Profile of {userDetails.firstName}
      </h2>
      <div className="bg-gradient-to-br from-indigo-100 to-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p className="mb-3">
            <span className="font-bold text-indigo-700">👤 Username:</span>{" "}
            {userDetails.userName}
          </p>
          <p className="mb-3">
            <span className="font-bold text-indigo-700">🪪 First Name:</span>{" "}
            {userDetails.firstName}
          </p>
          <p className="mb-3">
            <span className="font-bold text-indigo-700">🧾 Last Name:</span>{" "}
            {userDetails.lastName}
          </p>
        </div>
        <div>
          <p className="mb-3">
            <span className="font-bold text-indigo-700">📧 Email:</span>{" "}
            {userDetails.email}
          </p>
          <p className="mb-3">
            <span className="font-bold text-indigo-700">🎓 College:</span>{" "}
            {userDetails.collegeName}
          </p>
          <p className="mb-3">
            <span className="font-bold text-indigo-700">
              🛠️ Problems Contributed:
            </span>{" "}
            {userDetails.problemsContributed || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-2xl shadow-lg p-6 w-72 flex flex-col items-center gap-4">
          <div className="text-2xl font-semibold tracking-wide">
            ⭐ Your Score
          </div>
          <div className="w-24 h-24 bg-white text-indigo-600 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-inner border-4 border-white">
            {userDetails.score}
          </div>
          <p className="text-sm text-white/90 text-center">
            Keep solving problems to increase your score and improve your
            ranking!
          </p>
        </div>
      </div>

      <section>
        <h3 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          🧩 Problems Solved
        </h3>

        {problems.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200 text-gray-800">
              <thead className="bg-indigo-100 text-indigo-700 uppercase text-sm font-semibold tracking-wide">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 text-left">
                    📝 Problem Name
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">
                    🚦 Difficulty
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
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        {problem.problemName}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {problem.difficulty === "Easy" && "🟢"}
                        {problem.difficulty === "Medium" && "🟡"}
                        {problem.difficulty === "Hard" && "🔴"}
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No problems solved yet. 💤</p>
        )}
      </section>
    </div>
  );
};

export default UserDetails;