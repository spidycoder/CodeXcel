import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CompilerPage from "./CompilerPage";

const ProblemPage = () => {
  //here,useParams is used to fetch the details from URL
  const { problemName } = useParams();
  const [problem, setProblem] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/problems/${problemName}`)
      .then((res) => setProblem(res.data))
      .catch((error) => console.error("Error fetching problem:", error));
  }, [problemName]);
  if (!problem) return <div className="p-6">Loading....</div>;
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-2">{problemName}</h1>
      <p className="mb-4 text-gray-600">
        Difficulty:{" "}
        <span
          className={`font-semibold ${
            problem.difficulty === "Easy"
              ? "text-green-500"
              : problem.difficulty === "Medium"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {problem.difficulty}
        </span>
      </p>
      <p className="mb-4">{problem.description}</p>
      <p className="mb-4 font-semibold">Constraints: {problem.constraints}</p>
      <p className="mb-4 font-semibold">Contributor: {problem.authorName}</p>
      <div className="mb-4">
        <p className="font-semibold">Tags:</p>
        <ul className="list-disc list-inside">
          {problem.tags.map((tag, index) => (
            <li key={index} className="text-sm text-gray-700">
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold">Test Cases:</p>
        <ul className="space-y-2">
          {problem.testCases.map((test, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded">
              <p>
                <strong>Input:</strong> {test.input}
              </p>
              <p>
                <strong>Output:</strong> {test.output}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <CompilerPage />
    </div>
  );
};

export default ProblemPage;
