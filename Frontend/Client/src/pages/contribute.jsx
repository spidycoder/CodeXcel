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
  //taking the data of user from local storage
  const storedUser = localStorage.getItem("user");
  //parsing the data
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user.userName;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags,
      testCases,
      userName,
    };
    if (
      !formData.problemName ||
      !formData.description ||
      !formData.authorName ||
      !formData.difficulty ||
      !formData.constraints ||
      tags.length === 0 ||
      testCases.length === 0
    ) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/contribute", payload);
      console.log("Problem sent to backend", res.data);
      if (res.status == 200) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/problems";
      }
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status == 401) {
          setError(message);
        } else if (status == 400) {
          setError(message);
        }
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10 flex justify-center">
      <form
        className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white p-6 sm:p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Contribute
        </h1>

        {/* Problem Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Problem Name
          </label>
          <input
            type="text"
            name="problemName"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Unique problem name"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            rows={4}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter a short description"
          />
        </div>

        {/* Author Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Author Name
          </label>
          <input
            type="text"
            name="authorName"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="It should be your username"
          />
        </div>

        {/* Difficulty Level */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Difficulty
          </label>
          <select
            name="difficulty"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">--Select--</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Tags</label>
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center mb-2 gap-2"
            >
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className="w-full flex-grow border px-4 py-2 rounded-md"
                placeholder={`Tag ${index + 1}`}
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTagBox(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTagBox}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Tag
          </button>
        </div>

        {/* Constraints */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Constraints
          </label>
          <input
            type="text"
            name="constraints"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="e.g., 1 ≤ N ≤ 10⁵"
          />
        </div>

        {/* Test Cases */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Test Cases
          </label>
          {testCases.map((tc, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <textarea
                type="text"
                value={tc.input}
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
                className="w-full sm:w-1/2 border px-4 py-2 rounded-md"
                placeholder={`Input ${index + 1}`}
              />
              <textarea
                type="text"
                value={tc.output}
                onChange={(e) =>
                  handleTestCaseChange(index, "output", e.target.value)
                }
                className="w-full sm:w-1/2 border px-4 py-2 rounded-md"
                placeholder={`Output ${index + 1}`}
              />
              {testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcaseBox(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTestcaseBox}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Test Case
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Problem
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default Contribute;
