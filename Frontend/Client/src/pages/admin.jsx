import React, { useState } from "react";
import axios from "axios";
import AdminInfo from "../components/AdminInfo";

const Admin = () => {
  const [problemName, setProblemName] = useState("");
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

  const handleChange = (e) => {
    setProblemName(e.target.value);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:8000/problems/${problemName}`
      );
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
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <AdminInfo/>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            name="problemName"
            onChange={handleChange}
            placeholder="Search problem by name"
            className="w-full border px-4 py-2 rounded mb-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Find Problem
          </button>
        </div>

        {/* Editable Form */}
        {problemData && (
          <form className="space-y-6">
            <div>
              <label>Problem Name</label>
              <input
                type="text"
                name="problemName"
                value={formData.problemName}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label>Author Name</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">--Select--</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label>Tags</label>
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-grow border px-4 py-2 rounded"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTagBox(index)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTagBox}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                + Add Tag
              </button>
            </div>

            {/* Constraints */}
            <div>
              <label>Constraints</label>
              <input
                type="text"
                name="constraints"
                value={formData.constraints}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            {/* Test Cases */}
            <div>
              <label>Test Cases</label>
              {testCases.map((testCase, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(e) =>
                      handleTestCaseChange(index, "input", e.target.value)
                    }
                    className="flex-1 border px-4 py-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    value={testCase.output}
                    onChange={(e) =>
                      handleTestCaseChange(index, "output", e.target.value)
                    }
                    className="flex-1 border px-4 py-2 rounded"
                  />
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestcaseBox(index)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTestcaseBox}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                + Add Test Case
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Admin;
