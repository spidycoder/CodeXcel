import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  //for filter problems by difficulty and tags
  useEffect(() => {
    axios
      .get("http://localhost:8000/problems")
      .then((res) => {
        setProblems(res.data);
        setFilteredProblems(res.data);

        // Get all unique tags from problem list
        const tagSet = new Set();
        res.data.forEach((problem) =>
          //storing the tags into the set.
          problem.tags.forEach((tag) => tagSet.add(tag))
        );
        //now converting the set back to an array.
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
    setSelectedTags(
      (prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag) //remove if already selected
          : [...prevTags, tag] //add if not already selected
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Problems</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by problem name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full border ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredProblems.map((problem) => (
            <li key={problem._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">
                <Link to={`/problems/${problem.problemName}`}>
                  {problem.problemName}{" "}
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
                </Link>
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
