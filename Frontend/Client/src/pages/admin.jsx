import React, { useState } from "react";
import axios from "axios";
import AdminInfo from "../components/AdminInfo";

const Admin = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [problemNameOfForm, setProblemNameOfForm] = useState("");
  const [problemData, setProblemData] = useState(null);
  const [tags, setTags] = useState([""]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [formData, setFormData] = useState({
    problemName: "",
    description: "",
    authorName: "",
    difficulty: "",
    constraints: "",
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (index, value) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const addTagBox = () => {
    setTags([...tags, ""]);
  };

  const removeTagBox = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestcaseBox = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestcaseBox = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleFindProblem = async (e) => {
    e.preventDefault();
    try {
      if (problemNameOfForm === "") {
        setError("⚠️ Please enter a problem name.");
        return;
      }

      const res = await axios.get("http://localhost:8000/admin", {
        params: {
          problemName: problemNameOfForm,
          userInfo: user,
        },
      });

      const data = res.data;
      setProblemData(data);
      setFormData({
        problemName: data.problemName,
        description: data.description,
        authorName: data.authorName,
        difficulty: data.difficulty,
        constraints: data.constraints,
      });
      setTags(data.tags || [""]);
      setTestCases(data.testCases || [{ input: "", output: "" }]);
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status === 404) setError(`❌ ${message}`);
      } else {
        console.error("Error fetching problem:", error);
      }
    }
  };

  const handleUpdateProblem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        formData,
        tags,
        testCases,
      };

      const res = await axios.put("http://localhost:8000/admin", {
        problemInfo: payload,
        userInfo: user,
        problemNameOfForm: problemNameOfForm,
      });

      if (res.status === 200) {
        setSuccess("✅ Problem updated successfully!");
        setFormData({
          problemName: "",
          description: "",
          authorName: "",
          difficulty: "",
          constraints: "",
        });
        setTags([""]);
        setTestCases([{ input: "", output: "" }]);
      }
      setError("");
    } catch (error) {
      if (error.response) {
        const message = error.response.data;
        setError(`❌ ${message}`);
      } else {
        console.error("Error Updating problem:", error);
      }
    }
  };

  const handleDeleteProblem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete("http://localhost:8000/delete", {
        data: {
          userInfo: user,
          problemNameOfForm: problemNameOfForm,
        },
      });

      if (res.status === 200) {
        setSuccess("🗑️ Problem deleted successfully!");
        setFormData({
          problemName: "",
          description: "",
          authorName: "",
          difficulty: "",
          constraints: "",
        });
        setTags([""]);
        setTestCases([{ input: "", output: "" }]);
      }
      setError("");
    } catch (error) {
      if (error.response) {
        const message = error.response.data;
        setError(`❌ ${message}`);
      } else {
        console.error("Error deleting problem:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <AdminInfo />

        {/* Search Bar */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
            🔍 Search Problem
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="🔤 Enter problem name..."
              value={problemNameOfForm}
              onChange={(e) => setProblemNameOfForm(e.target.value)}
              className="flex-grow border border-gray-300 rounded-lg px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={handleFindProblem}
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              🔎 Find Problem
            </button>
          </div>
        </section>

        {/* Editable Form */}
        {problemData && (
          <form className="space-y-8">
            {/* Problem Details */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-gray-700 border-b pb-2">
                🧾 Problem Details 🛠️
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-semibold text-gray-600">
                    ✏️ Problem Name
                  </label>
                  <input
                    type="text"
                    name="problemName"
                    value={formData.problemName}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-600">
                    👤 Author Name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-600">
                    💪 Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  >
                    <option value="">-- Select Difficulty --</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-600">
                    📏 Constraints
                  </label>
                  <input
                    type="text"
                    name="constraints"
                    value={formData.constraints}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-600">
                  📝 Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                />
              </div>
            </section>

            {/* Tags */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700 border-b pb-2">
                🏷️ Tags ✨
              </h3>
              {tags.map((tag, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    value={tag}
                    onChange={(e) => handleTagChange(i, e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    placeholder="🔖 Tag"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTagBox(i)}
                      className="text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 transition shadow"
                      aria-label="Remove tag"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTagBox}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                ➕ Add Tag
              </button>
            </section>

            {/* Test Cases */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700 border-b pb-2">
                🧪 Test Cases 🧬
              </h3>
              {testCases.map((testCase, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-4 items-center"
                >
                  <textarea
                    placeholder="📥 Input"
                    value={testCase.input}
                    onChange={(e) =>
                      handleTestCaseChange(i, "input", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                    rows={3}
                  />
                  <textarea
                    placeholder="📤 Output"
                    value={testCase.output}
                    onChange={(e) =>
                      handleTestCaseChange(i, "output", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                    rows={3}
                  />
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestcaseBox(i)}
                      className="text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 transition shadow"
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTestcaseBox}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                ➕ Add Test Case
              </button>
            </section>

            {/* Actions */}
            <section className="flex flex-col sm:flex-row gap-6 justify-end pt-4 border-t border-gray-300">
              <button
                type="submit"
                onClick={handleUpdateProblem}
                className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold rounded-lg px-8 py-3 shadow-md"
              >
                💾 Update Problem
              </button>
              <button
                type="button"
                onClick={handleDeleteProblem}
                className="bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded-lg px-8 py-3 shadow-md"
              >
                🗑️ Delete Problem
              </button>
            </section>
          </form>
        )}

        {/* Messages */}
        {error && (
          <div className="mt-6 text-red-700 bg-red-100 border border-red-300 rounded-lg px-4 py-3 flex items-center gap-2">
            ❗ <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-3 flex items-center gap-2">
            ✅ <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
