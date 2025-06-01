import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LeaderBoard = () => {
  const [performerDetails, setPerformerDetails] = useState(null);
  const [contributionDetails, setContributionDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`)
      .then((res) => {
        const data = res.data;
        setPerformerDetails(data.performance);
        setContributionDetails(data.contributions);
      })
      .catch((error) =>
        console.error("Failed to fetch leaderboard data:", error)
      );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🏆 Leaderboard</h1>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-12">
        {/* Top Performers Table */}
        <div>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            🥇 Top Performers
          </h2>
          {performerDetails ? (
            <div className="overflow-x-auto rounded-md border border-gray-300">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-indigo-100">
                  <tr className="text-gray-700 text-md">
                    <th className="px-4 py-3 border">Rank</th>
                    <th className="px-4 py-3 border">Name</th>
                    <th className="px-4 py-3 border">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {performerDetails.map((user, index) => (
                    <tr
                      key={index}
                      className="text-center hover:bg-indigo-50 transition duration-200"
                    >
                      <td className="px-4 py-2 border">{user.rank}</td>
                      <td className="px-4 py-2 border text-indigo-700 font-medium">
                        <Link
                          to={`/profile/${user.userName}`}
                          className="hover:underline cursor-pointer"
                        >
                          {user.userName}
                        </Link>
                      </td>
                      <td className="px-4 py-2 border">{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500">Loading performer details...</div>
          )}
        </div>

        {/* Top Contributors Table */}
        <div>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            🌟 Top Contributors
          </h2>
          {contributionDetails ? (
            <div className="overflow-x-auto rounded-md border border-gray-300">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-green-100">
                  <tr className="text-gray-700 text-md">
                    <th className="px-4 py-3 border">Rank</th>
                    <th className="px-4 py-3 border">Name</th>
                    <th className="px-4 py-3 border">Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {contributionDetails.map((user, index) => (
                    <tr
                      key={index}
                      className="text-center hover:bg-green-50 transition duration-200"
                    >
                      <td className="px-4 py-2 border">{user.rank}</td>
                      <td className="px-4 py-2 border text-green-700 font-medium">
                        <Link
                          to={`/profile/${user.userName}`}
                          className="hover:underline cursor-pointer"
                        >
                          {user.userName}
                        </Link>
                      </td>
                      <td className="px-4 py-2 border">{user.contributions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500">Loading contributor details...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
