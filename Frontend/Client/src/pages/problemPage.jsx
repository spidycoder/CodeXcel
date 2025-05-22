import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";

const ProblemPage = () => {
  //here,useParams is used to fetch the details from URL
  const { problemName } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState([""]);
  const [output, setOutput] = useState([""]);
  const [error, setError] = useState("");
  const handleRun = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/run", {
        input,
        problemName,
        language,
        code,
      });
      setOutput(res.data.output);
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status == 400) {
          setError(message);
        } else if (status == 401) {
          setError(message);
        } else if (status == 402) {
          setError(message);
        } else if (status == 403) {
          setError(message);
        } else if (status == 405) {
          setError(message);
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleSubmit = () => {
    setOutput(`Code submitted successfully in ${language.toUpperCase()}!`);
  };

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
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center">
            Online Code Compiler
          </h1>

          {/* Language Selector */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label htmlFor="language" className="font-semibold">
              Choose Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border px-4 py-2 rounded w-full md:w-1/3"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          {/* Monaco Editor */}
          <div className="border rounded overflow-hidden">
            <Editor
              height="400px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Input Section */}
          <div>
            <label htmlFor="input" className="block font-semibold mb-2">
              Custom Input:
            </label>
            <textarea
              id="input"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your program"
              className="w-full border rounded px-4 py-2 bg-gray-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleRun}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full md:w-auto"
            >
              Submit
            </button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {/* Output Section */}
          <div>
            <label htmlFor="output" className="block font-semibold mb-2">
              Output:
            </label>
            <textarea
              id="output"
              value={output}
              readOnly
              rows={8}
              className="w-full border rounded px-4 py-2 bg-gray-200 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
