import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DataTable = ({ title, dataKey, columns, linkPrefix, color }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`)
      .then((res) => {
        setData(res.data[dataKey]);
      })
      .catch((error) => console.error(`Failed to fetch ${title} data:`, error));
  }, [dataKey, title]);

  const headerBg = color === "indigo" ? "bg-indigo-100" : "bg-green-100";
  const rowHoverBg =
    color === "indigo" ? "hover:bg-indigo-50" : "hover:bg-green-50";
  const textColor = color === "indigo" ? "text-indigo-700" : "text-green-700";

  return (
    <div>
      <h2
        className={`text-2xl font-semibold mb-4 ${
          color === "indigo" ? "text-indigo-600" : "text-green-600"
        }`}
      >
        {title}
      </h2>
      {data ? (
        <div className={`overflow-x-auto rounded-md border border-gray-300`}>
          <table className="min-w-full table-auto border-collapse">
            <thead className={headerBg}>
              <tr className="text-gray-700 text-md">
                {columns.map(({ key, label }) => (
                  <th key={key} className="px-4 py-3 border">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr
                  key={index}
                  className={`text-center ${rowHoverBg} transition duration-200`}
                >
                  {columns.map(({ key, isLink }) => (
                    <td
                      key={key}
                      className={`px-4 py-2 border ${
                        key === "userName" ? textColor + " font-medium" : ""
                      }`}
                    >
                      {isLink ? (
                        <Link
                          to={`${linkPrefix}/${user[key]}`}
                          className="hover:underline cursor-pointer"
                        >
                          {user[key]}
                        </Link>
                      ) : (
                        user[key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">Loading {title.toLowerCase()}...</div>
      )}
    </div>
  );
};

const LeaderBoard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🏆 Leaderboard</h1>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-12">
        <DataTable
          title="🥇 Top Performers"
          dataKey="performance"
          linkPrefix="/profile"
          color="indigo"
          columns={[
            { key: "rank", label: "Rank" },
            { key: "userName", label: "Name", isLink: true },
            { key: "score", label: "Score" },
          ]}
        />

        <DataTable
          title="🌟 Top Contributors"
          dataKey="contributions"
          linkPrefix="/profile"
          color="green"
          columns={[
            { key: "rank", label: "Rank" },
            { key: "userName", label: "Name", isLink: true },
            { key: "contributions", label: "Contributions" },
          ]}
        />
      </div>
    </div>
  );
};

export default LeaderBoard;
