import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; 

const AIReviewCard = ({ reviewText }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {reviewText}
      </ReactMarkdown>
    </div>
  );
};

export default AIReviewCard;
