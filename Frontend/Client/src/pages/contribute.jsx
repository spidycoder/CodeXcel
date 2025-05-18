import axios from "axios";
import React, { useState } from "react";

const Contribute = () => {
  const [tags, setTags] = useState([""]);
  const [formData, setFormData] = useState({
    problemName: "",
    description: "",
    difficultyLevel: "",
    tags: [""],
  });
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post(
        "http://localhost:8000/contribute",
        formData
      );
      console.log("Problem sent to backend", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-300 p-6 flex justify-center">
      <form
        className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Contribute
        </h1>

        {/* Problem Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-1"
          >
            Problem Name
          </label>
          <input
            type="text"
            id="name"
            name="problemName"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Unique problem name"
          />
          <p className="text-sm text-gray-500 mt-1">
            Problem name should be unique
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-1"
          >
            Description of Problem
          </label>
          <textarea
            type="text"
            id="description"
            name="description"
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="write about the problem"
          />
        </div>
        {/* Difficulty */}
        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="block text-gray-700 font-semibold mb-1"
          >
            Difficulty Level
          </label>
          <select
            id="difficulty"
            name="difficulty"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Tags</label>
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                name="tags"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className="flex-grow border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Tag ${index + 1}`}
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTagBox(index)}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTagBox}
            className="mt-2 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            + Add Tag
          </button>
        </div>

        {/* Submit (Optional) */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Problem
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contribute;
