import axios from "axios";
import React, { useState, useEffect } from "react";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/problems")
      .then((res) => setProblems(res.data))
      .catch((error) => console.error("Error Wihle Fetching Problem", error));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Problems</h1>
      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <ul className="space-y-4">
          {problems.map((problem) => (
            <li key={problem._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">
                {problem.problemName}{" "}
                {
                  <span
                    className={`${
                      problem.difficulty === "Easy"
                        ? "text-green-500"
                        : problem.difficulty === "Medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    ({problem.difficulty})
                  </span>
                }
              </h2>
              <p>{problem.description}</p>
              <p className="text-sm text-gray-600">
                Tags: {problem.tags.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Problems;
