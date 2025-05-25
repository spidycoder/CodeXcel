import React from "react";
import { Link } from "react-router-dom";
import studentSVG from "../assets/student-typing.svg"; 

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex items-center justify-center px-6 py-12">

      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center gap-12">
        
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Welcome to <span className="text-blue-600">SpidyOJ</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Practice coding, improve your skills, and master data structures &
            algorithms with real-time code evaluation.
          </p>

          <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-300 text-md space-y-2">
            <li>💻 Solve curated coding problems across all levels</li>
            <li>📊 Get instant feedback and performance stats</li>
            <li>🎯 Learn with hints, editorials, and test cases</li>
            <li>🧠 Compete in weekly coding challenges</li>
            <li>📁 Track your progress with user profiles</li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4 pt-4">
            <Link
              to="/problems"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition transform hover:scale-[1.03]"
            >
              Start Solving
            </Link>
            <Link
              to="/contribute"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:bg-transparent dark:border-blue-400 dark:text-blue-400 hover:dark:bg-blue-950 transition transform hover:scale-[1.03]"
            >
              Contribute to the Community
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src={studentSVG}
            alt="Student typing"
            className="w-full max-w-md mx-auto md:mx-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
