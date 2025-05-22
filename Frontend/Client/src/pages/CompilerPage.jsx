import { useState } from "react";
import Editor from "@monaco-editor/react";

const CompilerPage = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState([""]);
  const [output, setOutput] = useState([""]);

  const handleRun = () => {
    setOutput(
      `Running ${language.toUpperCase()}...\n\nCode:\n${code}\n\nInput:\n${input}`
    );
  };

  const handleSubmit = () => {
    setOutput(`Code submitted successfully in ${language.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Online Code Compiler</h1>

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
  );
};

export default CompilerPage;
