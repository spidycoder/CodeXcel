import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const sparseUser = JSON.parse(localStorage.getItem("user"));
  const userName = sparseUser ? sparseUser.userName : null;

  useEffect(() => {
    if (!userName) return;
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/user`, { userName })
      .then((res) => {
        setSolvedProblems(res.data);
      })
      .catch((error) => {
        console.error("Error fetching solved problems:", error);
      });
  }, [userName]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/problems`)
      .then((res) => {
        setProblems(res.data);
        setFilteredProblems(res.data);

        const tagSet = new Set();
        res.data.forEach((problem) =>
          problem.tags.forEach((tag) => tagSet.add(tag))
        );
        setAllTags([...tagSet]);
      })
      .catch((error) => console.error("Error While Fetching Problem", error));
  }, []);

  useEffect(() => {
    const filtered = problems.filter((problem) => {
      const nameMatch = problem.problemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const difficultyMatch =
        difficultyFilter === "All" || problem.difficulty === difficultyFilter;
      const tagsMatch =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => problem.tags.includes(tag));
      return nameMatch && difficultyMatch && tagsMatch;
    });
    setFilteredProblems(filtered);
  }, [searchTerm, difficultyFilter, selectedTags, problems]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
          🧠 Solve Coding Problems 🚀
        </h1>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-3 mb-6 items-center">
          <input
            type="text"
            placeholder="🔍 Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm shadow-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm shadow-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          >
            <option value="All">🎯 All Difficulties</option>
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>

          <div className="flex flex-wrap gap-1">
            {allTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleTagToggle(tag)}
                className={`px-2 py-1 rounded-full text-xs font-medium border transition ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                🏷️ {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        {filteredProblems.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            😕 No problems found. Try adjusting your filters!
          </div>
        ) : (
          <ul className="space-y-6">
            {filteredProblems.map((problem, index) => {
              const isSolved = solvedProblems.includes(problem.problemName);

              return (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-2">
                    {/* Solved / Unsolved icon */}
                    {isSolved ? (
                      <FaCheckCircle
                        className="text-green-600"
                        title="✅ Solved"
                        aria-label="✅ Solved"
                      />
                    ) : (
                      <FaRegCircle
                        className="text-gray-400"
                        title="⭕ Unsolved"
                        aria-label="⭕ Unsolved"
                      />
                    )}

                    <Link
                      to={`/problems/${problem.problemName}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {index + 1}. {problem.problemName}
                    </Link>
                  </div>
                    
                  <div className="mt-2 text-gray-600">
                    {problem.description}
                  </div>

                  <div className="mt-3 flex flex-wrap justify-between items-center">
                    <span
                      className={`font-medium ${
                        problem.difficulty === "Easy"
                          ? "text-green-600"
                          : problem.difficulty === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {problem.difficulty === "Easy"
                        ? "🟢 Easy"
                        : problem.difficulty === "Medium"
                        ? "🟡 Medium"
                        : "🔴 Hard"}
                    </span>

                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      {problem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          🏷️ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Problems;
