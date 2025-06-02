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
      setError("⚠️ All fields are required!");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/contribute`,
        payload
      );
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
          setError(`🚫 ${message}`);
        }
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-black-900 mb-3">
          Contribute a Coding Problem
        </h1>
        <p className="text-black-700 text-lg font-medium">
          🚀 Share your own coding challenge and help the community grow!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto bg-white bg-opacity-90 shadow-xl rounded-2xl p-10 sm:p-14 border border-indigo-200"
      >
        <div className="mb-6">
          <label
            htmlFor="problemName"
            className="block text-indigo-900 font-semibold mb-2"
          >
            Problem Name 🏷️
          </label>
          <input
            id="problemName"
            type="text"
            name="problemName"
            onChange={handleChange}
            placeholder="Unique problem name"
            className="w-full border border-indigo-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-indigo-900 font-semibold mb-2"
          >
            Description 📝
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            rows={5}
            placeholder="Enter a short description"
            className="w-full border border-indigo-300 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="authorName"
            className="block text-indigo-900 font-semibold mb-2"
          >
            Author Name 🙋‍♂️
          </label>
          <input
            id="authorName"
            type="text"
            name="authorName"
            onChange={handleChange}
            placeholder="It should be your username"
            className="w-full border border-indigo-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="difficulty"
            className="block text-indigo-900 font-semibold mb-2"
          >
            Difficulty 🎯
          </label>
          <select
            id="difficulty"
            name="difficulty"
            onChange={handleChange}
            className="w-full border border-indigo-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue=""
          >
            <option disabled value="">
              -- Select Difficulty --
            </option>
            <option value="Easy">Easy 😎</option>
            <option value="Medium">Medium 🤔</option>
            <option value="Hard">Hard 😤</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-indigo-900 font-semibold mb-3">
            Tags 🏷️
          </label>
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder={`Tag ${index + 1}`}
                className="flex-grow border border-indigo-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTagBox(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  title="Remove Tag"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTagBox}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            title="Add Tag"
          >
            ➕ Add Tag
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="constraints"
            className="block text-indigo-900 font-semibold mb-2"
          >
            Constraints ⚙️
          </label>
          <input
            id="constraints"
            type="text"
            name="constraints"
            onChange={handleChange}
            placeholder="e.g., 1 ≤ N ≤ 10⁵"
            className="w-full border border-indigo-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-8">
          <label className="block text-indigo-900 font-semibold mb-4">
            Test Cases 🧪
          </label>
          {testCases.map((tc, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4">
              <textarea
                value={tc.input}
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
                placeholder={`Input ${index + 1}`}
                rows={3}
                className="w-full sm:w-1/2 border border-indigo-300 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={tc.output}
                onChange={(e) =>
                  handleTestCaseChange(index, "output", e.target.value)
                }
                placeholder={`Output ${index + 1}`}
                rows={3}
                className="w-full sm:w-1/2 border border-indigo-300 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcaseBox(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg self-start"
                  title="Remove Test Case"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTestcaseBox}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            title="Add Test Case"
          >
            ➕ Add Test Case
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-lg transition"
          >
            🚀 Submit Problem
          </button>
        </div>

        {error && (
          <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>
        )}

        
      </form>
    </div>
  );
};

export default Contribute;
