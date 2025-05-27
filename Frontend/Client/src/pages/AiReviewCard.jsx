import React, { useState } from "react";

const parseReview = (reviewText) => {
  const lines = reviewText.split("\n").filter(Boolean);
  const sections = [];
  let currentSection = { title: "", content: [] };

  lines.forEach((line) => {
    if (line.startsWith("##")) {
      if (currentSection.title) sections.push(currentSection);
      currentSection = { title: line.replace(/^#+\s*/, ""), content: [] };
    } else if (line.startsWith("* ") || line.startsWith("- ")) {
      currentSection.content.push({
        type: "list",
        text: line.replace(/^[-*]\s*/, ""),
      });
    } else if (line.startsWith("```")) {
      // skip code block markers
    } else if (line.startsWith("    ") || line.match(/^\s{4,}/)) {
      const code = line.trim();
      if (
        currentSection.content.length &&
        currentSection.content[currentSection.content.length - 1].type ===
          "code"
      ) {
        currentSection.content[currentSection.content.length - 1].text +=
          "\n" + code;
      } else {
        currentSection.content.push({ type: "code", text: code });
      }
    } else {
      currentSection.content.push({ type: "paragraph", text: line });
    }
  });

  if (currentSection.title) sections.push(currentSection);

  return sections;
};

const CopyCodeButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback or error handling if needed
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-md font-semibold
        ${
          copied
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }
      `}
      aria-label="Copy code to clipboard"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const AIReviewCard = ({ reviewText }) => {
  const sections = parseReview(reviewText);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-8">
      {sections.map((section, index) => (
        <section
          key={index}
          className="border border-gray-200 rounded-lg p-5 bg-gray-50"
        >
          <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.content.map((item, idx) => {
              if (item.type === "paragraph") {
                return (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {item.text}
                  </p>
                );
              } else if (item.type === "list") {
                return (
                  <ul
                    key={idx}
                    className="list-disc list-inside text-gray-700 ml-4"
                  >
                    <li>{item.text}</li>
                  </ul>
                );
              } else if (item.type === "code") {
                return (
                  <div key={idx} className="relative">
                    <CopyCodeButton code={item.text} />
                    <pre
                      className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm font-mono"
                      tabIndex={0}
                    >
                      <code>{item.text}</code>
                    </pre>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AIReviewCard;
