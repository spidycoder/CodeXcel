import axios from "axios";
import React, { useState } from "react";

const Contribute = () => {
  const [error, setError] = useState("");
  const [tags, setTags] = useState([""]);
  const [testCases, setTestcases] = useState([{ input: "", output: "" }]);
  const [formData, setFormData] = useState({
    problemName: "",
    description: "",
    authorName: "",
    difficulty: "",
    constraints: "",
  });

  const addTestcaseBox = (e) => {
    e.preventDefault();
    setTestcases([...testCases, { input: "", output: "" }]);
  };

  const removeTestcaseBox = (index) => {
    setTestcases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestcases(updated);
  };

  const addTagBox = (e) => {
    e.preventDefault();
    setTags([...tags, ""]);
  };

  const removeTagBox = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagChange = (index, value) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.userName || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags,
      testCases,
      userName,
    };
    if (
      !formData.problemName.trim() ||
      !formData.description.trim() ||
      !formData.authorName.trim() ||
      !formData.difficulty.trim() ||
      !formData.constraints.trim() ||
      tags.length === 0 ||
      testCases.length === 0
    ) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/contribute", payload);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/problems";
      }
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status === 401 || status === 400) {
          setError(message);
        }
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 sm:p-12"
      >
        <h1 className="text-4xl font-extrabold text-gray-700 mb-8 text-center">
          Contribute a Problem
        </h1>

        {/* Problem Name */}
        <div className="mb-6">
          <label
            htmlFor="problemName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Problem Name
          </label>
          <input
            id="problemName"
            type="text"
            name="problemName"
            onChange={handleChange}
            placeholder="Unique problem name"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            rows={5}
            placeholder="Enter a short description"
            className="w-full border border-gray-300 rounded-md px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Author Name */}
        <div className="mb-6">
          <label
            htmlFor="authorName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Author Name
          </label>
          <input
            id="authorName"
            type="text"
            name="authorName"
            onChange={handleChange}
            placeholder="It should be your username"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <label
            htmlFor="difficulty"
            className="block text-gray-700 font-semibold mb-2"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            defaultValue=""
          >
            <option disabled value="">
              -- Select Difficulty --
            </option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3">Tags</label>
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 mb-3"
            >
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder={`Tag ${index + 1}`}
                className="flex-grow border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTagBox(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTagBox}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            + Add Tag
          </button>
        </div>

        {/* Constraints */}
        <div className="mb-6">
          <label
            htmlFor="constraints"
            className="block text-gray-700 font-semibold mb-2"
          >
            Constraints
          </label>
          <input
            id="constraints"
            type="text"
            name="constraints"
            onChange={handleChange}
            placeholder="e.g., 1 ≤ N ≤ 10⁵"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Test Cases */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-4">
            Test Cases
          </label>
          {testCases.map((tc, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 mb-4 items-start"
            >
              <textarea
                value={tc.input}
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
                placeholder={`Input ${index + 1}`}
                rows={3}
                className="w-full sm:w-1/2 border border-gray-300 rounded-md px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <textarea
                value={tc.output}
                onChange={(e) =>
                  handleTestCaseChange(index, "output", e.target.value)
                }
                placeholder={`Output ${index + 1}`}
                rows={3}
                className="w-full sm:w-1/2 border border-gray-300 rounded-md px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcaseBox(index)}
                  className="mt-1 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition self-start"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTestcaseBox}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            + Add Test Case
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-8 py-3 rounded-md transition"
          >
            Submit Problem
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Contribute;
