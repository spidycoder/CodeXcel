import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import ReactConfetti from "react-confetti";
import AIReviewCard from "./AiReviewCard";

const ProblemPage = () => {
  const { problemName } = useParams();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [problem, setProblem] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState("cpp");  
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [accept, setAccept] = useState("");
  const [editorTheme, setEditorTheme] = useState("light");
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [aiReview, setAiReview] = useState("");
  const [showAIReviewModal, setShowAIReviewModal] = useState(false);
  const [aiReviewLoading, setAIReviewLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.userName;

  const boilerplates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // your code goes here
    cout<<"Hello World"<<endl;
    return 0;
}
`,
    py: `def main():
    # your code goes here
    print("Hello World")

if __name__ == "__main__":
    main()
`,
    java: `public class Main {
    public static void main(String[] args) {
        // your code goes here
        System.out.println("Hello World");
    }
}
`,
 
  };

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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/run`, {
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
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/submit`,
        {
          language,
          code,
          problemName,
          userName,
        }
      );

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

  const handleAIReview = async () => {
    setAIReviewLoading(true);
    setShowAIReviewModal(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai-review`,
        {
          code,
        }
      );
      setAiReview(res.data.review);
      setError("");
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
      setAIReviewLoading(false);
    }
  };
  useEffect(() => {
    if (!problemName) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/recommendations/by-problem/${problemName}`)
      .then(res => setRecommendations(res.data))
      .catch(err => setRecommendations([]));
  }, [problemName]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/problems/${problemName}`)
      .then((res) => setProblem(res.data))
      .catch((error) => console.error("Error fetching problem:", error));
  }, [problemName]);

  useEffect(() => {
    if (showSubmissions && userName) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/submissions`, {
          userName,
          problemName,
        })
        .then((res) => setSubmissions(res.data))
        .catch((err) => console.error("Failed to fetch submissions", err));
    }
  }, [showSubmissions, userName, problemName]);

  useEffect(() => {
    setCode(boilerplates[language] || "");
  }, [language]);

  if (!problem) return <div className="p-6">Loading....</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800 p-4 relative">
      {accept === "Accepted" && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="mb-4">
        <button
          onClick={() => setShowSubmissions((prev) => !prev)}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {showSubmissions ? "Show Problem Details" : "Show My Submissions"}
        </button>
      </div>

      {!showSubmissions ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{problemName}</h1>
              <p className="text-sm text-gray-600 mb-2">
                Difficulty: <span className={`font-semibold ${problem.difficulty === "Easy" ? "text-green-500" : problem.difficulty === "Medium" ? "text-yellow-500" : "text-red-500"}`}>{problem.difficulty}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">Contributor: {problem.authorName}</p>
              <p className="mb-4">{problem.description}</p>
              <p className="font-semibold mb-2">Constraints: {problem.constraints}</p>
              <div className="mb-4">
                <p className="font-semibold">Tags:</p>
                <ul className="list-disc list-inside text-sm">
                  {problem.tags.map((tag, i) => (<li key={i}>{tag}</li>))}
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Sample Test Cases:</p>
                <ul className="space-y-2">
                  {problem.testCases.map((tc, i) => (
                    <li key={i} className="bg-gray-100 p-2 rounded border">
                      <p><strong>Input:</strong> {tc.input}</p>
                      <p><strong>Output:</strong> {tc.output}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowRecommendations((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 mt-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded shadow hover:from-indigo-600 hover:to-blue-600"
              >
                <span>Recommended for you</span>
                <svg className={`w-4 h-4 transition-transform ${showRecommendations ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showRecommendations && (
                <div className="mt-4 bg-gray-50 rounded border p-4 shadow-inner">
                  <h3 className="font-bold text-indigo-600 mb-3">You might also like:</h3>
                  <ul className="space-y-2">
                    {recommendations.length === 0 ? (
                      <li className="text-sm text-gray-500">No recommendations found.</li>
                    ) : (
                      recommendations.map(problem => (
                        <li key={problem.problemName} className="flex items-center justify-between bg-indigo-100 rounded p-2">
                          <div>
                            <span className="font-semibold text-indigo-800">{problem.problemName}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded font-medium ${problem.difficulty === "Easy" ? "bg-green-200 text-green-800" : problem.difficulty === "Medium" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}>{problem.difficulty}</span>
                          </div>
                          <Link to={`/problems/${problem.problemName}`} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Solve</Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-4">
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
                </select>
              </div>
              <button
                onClick={() =>
                  setEditorTheme((prev) =>
                    prev === "light" ? "vs-dark" : "light"
                  )
                }
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                {editorTheme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>

            {/* Editor */}
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

              {accept === "Accepted" ? (
                <button
                  onClick={handleAIReview}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full"
                >
                  AI Review
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "bg-green-300"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-4 py-2 rounded w-full`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">
                  Custom Input:
                </label>
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
              <p className="text-red-600 font-semibold text-center mt-2">
                {error}
              </p>
            )}
            {showAIReviewModal && (
              <>
                {/* Dark backdrop */}
                <div
                  className="fixed inset-0 bg-blur bg-opacity-50 z-40"
                  onClick={() => setShowAIReviewModal(false)}
                />

                {/* Popup Modal */}
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                    {/* Close button */}
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
                      onClick={() => setShowAIReviewModal(false)}
                      aria-label="Close AI Review"
                    >
                      &times;
                    </button>

                    {/* Modal Content */}
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">
                      AI Code Review
                    </h3>

                    {aiReviewLoading ? (
                      <p className="text-gray-600">
                        Your AI review is on the way...
                      </p>
                    ) : (
                      <div className="whitespace-pre-line text-sm text-gray-800 max-h-64 overflow-y-auto p-3 border rounded bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <AIReviewCard reviewText={aiReview} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {aiReview && (
              <button
                onClick={handleAIReview}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full"
              >
                AI Review
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            My Submissions for "{problemName}"
          </h2>

          {submissions && submissions.length === 0 ? (
            <p className="text-gray-500">No submissions yet.</p>
          ) : (
            <ul className="space-y-6">
              {submissions.submissions.map((s, index) => (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 relative bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-700 space-x-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        {s.language?.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          s.verdict === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.verdict}
                      </span>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(s.code)}
                      className="text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-300 px-2 py-1 rounded shadow-sm transition active:scale-95"
                      title="Copy Code"
                    >
                      Copy
                    </button>
                  </div>

                  <pre className="bg-gray-100 mt-2 p-3 rounded text-sm overflow-auto max-h-64">
                    {s.code}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted: {new Date(s.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
