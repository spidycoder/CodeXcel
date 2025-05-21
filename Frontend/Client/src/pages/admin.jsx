import React, { useState } from "react";
import axios from "axios";
import AdminInfo from "../components/AdminInfo";

const Admin = () => {
  const [error, setError] = useState("");
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

  const handleSearchBarChange = (e) => {
    setProblemNameOfForm(e.target.value);
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
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  if (user) {
    console.log("UserInfo from frontend from admin's page", user);
  }
  const handleFindProblem = async (e) => {
    e.preventDefault();
    try {
      if (problemNameOfForm === "") {
        setError("fill the problem name correctly");
        return;
      }
      //here,we need to send the problemName as {problemName:problemNameOfForm}.
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
        if (status == 404) {
          setError(message);
        }
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
      const data = res.data;
      console.log("data received from backend", data);
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status == 404) {
          setError(message);
        } else if (status == 401) {
          setError(message);
        }
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
      const data = res.data;
      console.log("data received from backend", data);
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status == 404) {
          setError(message);
        } else if (status == 401) {
          setError(message);
        }
      } else {
        console.error("Error Updating problem:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-8">
        <AdminInfo />
        {/* Search Bar */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Search Problem</h2>
          <input
            type="text"
            placeholder="Search problem by name"
            value={problemNameOfForm}
            onChange={handleSearchBarChange}
            className="w-full border px-4 py-2 rounded mb-2"
          />
          <button
            onClick={handleFindProblem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Find Problem
          </button>
        </div>

        {/* Editable Form */}
        {problemData && (
          <form className="space-y-6">
            <div>
              <label className="font-semibold">Problem Name</label>
              <input
                type="text"
                name="problemName"
                value={formData.problemName}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Author Name</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Difficulty</label>
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
              <label className="font-semibold">Tags</label>
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 border px-4 py-2 rounded"
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
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                + Add Tag
              </button>
            </div>

            {/* Constraints */}
            <div>
              <label className="font-semibold">Constraints</label>
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
              <label className="font-semibold">Test Cases</label>
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-2 mb-2"
                >
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
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                + Add Test Case
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdateProblem}
              >
                Update
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteProblem}
              >
                Delete
              </button>
            </div>
          </form>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default Admin;
