import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import ReactConfetti from "react-confetti";

const ProblemPage = () => {
  const { problemName } = useParams();
  const [problem, setProblem] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [accept, setAccept] = useState("");
  const [editorTheme, setEditorTheme] = useState("light");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.userName;

  // Custom hook to track window size for confetti
  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  };

  const { width, height } = useWindowSize();

  const handleRun = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await axios.post("http://localhost:8000/run", {
        input,
        problemName,
        language,
        code,
      });
      setOutput(res.data.output);
      setError("");
      setAccept("");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data;
      if ([400, 401, 402, 403].includes(status)) {
        setError(message);
      } else if (status === 405) {
        setOutput(message);
      } else {
        console.error(error);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:8000/submit", {
        language,
        code,
        problemName,
        userName,
      });

      const allPassed = res.data.results.every(
        (result) => result.verdict === "Accepted"
      );
      setAccept(allPassed ? "Accepted" : "Failed");

      setOutput(
        res.data.results
          .map(
            (result, idx) =>
              `Test Case ${idx + 1}: ${result.verdict}\nInput: ${
                result.input
              }\nExpected: ${result.expectedOutput}\nReceived: ${
                result.receivedOutput
              }\n`
          )
          .join("\n")
      );

      setError("");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data;
      if ([401, 402, 403].includes(status)) {
        setError(message);
      } else if (status === 405) {
        setOutput(message);
      } else {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/problems/${problemName}`)
      .then((res) => setProblem(res.data))
      .catch((error) => console.error("Error fetching problem:", error));
  }, [problemName]);

  if (!problem) return <div className="p-6">Loading....</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800 p-4 relative">
      {/* Confetti Celebration */}
      {accept === "Accepted" && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: Problem Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-2">{problemName}</h1>
          <p className="text-sm text-gray-600 mb-2">
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
          <p className="text-sm text-gray-600 mb-4">
            Contributor: {problem.authorName}
          </p>

          <p className="mb-4">{problem.description}</p>
          <p className="font-semibold mb-2">Constraints: {problem.constraints}</p>

          <div className="mb-4">
            <p className="font-semibold">Tags:</p>
            <ul className="list-disc list-inside text-sm">
              {problem.tags.map((tag, i) => (
                <li key={i}>{tag}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">Sample Test Cases:</p>
            <ul className="space-y-2">
              {problem.testCases.map((tc, i) => (
                <li key={i} className="bg-gray-100 p-2 rounded border">
                  <p>
                    <strong>Input:</strong> {tc.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {tc.output}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL: Editor & Controls */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-4">
          {/* Language and Theme Selector */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <label className="font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="py">Python</option>
                <option value="js">JavaScript</option>
              </select>
            </div>

            <button
              onClick={() =>
                setEditorTheme((prev) => (prev === "light" ? "vs-dark" : "light"))
              }
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              {editorTheme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>

          {/* Code Editor */}
          <div className="border rounded overflow-hidden">
            <Editor
              height="300px"
              language={language}
              theme={editorTheme}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          {/* Run & Submit Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`${
                isRunning ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded w-full`}
            >
              {isRunning ? "Running..." : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
              } text-white px-4 py-2 rounded w-full`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* Input & Output Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Custom Input:</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={6}
                className="w-full border rounded p-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Output:</label>
              <textarea
                value={output}
                readOnly
                rows={6}
                className="w-full border rounded p-2 bg-gray-100 font-mono"
              />
            </div>
          </div>

          {accept && (
            <p
              className={`text-center font-bold ${
                accept === "Accepted" ? "text-green-600" : "text-red-600"
              }`}
            >
              {accept}
            </p>
          )}

          {error && (
            <p className="text-red-600 font-semibold text-center mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
