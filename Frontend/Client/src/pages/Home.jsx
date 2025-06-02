import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import studentSVG from "../assets/student-typing.svg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 space-y-6 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Welcome to <span className="text-blue-600">CodeXcel</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
            Where Passion Meets Code 💡
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            CodeXcel is your gateway to mastering data structures, algorithms,
            and coding interviews — all with real-time code evaluation.
          </p>

          <ul className="text-left list-inside text-gray-700 dark:text-gray-300 text-md space-y-2">
            <li>✅ Curated coding problems from beginner to advanced</li>
            <li>⚡ Instant code evaluation with performance insights</li>
            <li>🧠 AI-Powered Code Reviewer for smart feedback and tips</li>
            <li>📚 Access editorials, hints, and detailed test cases</li>
            <li>🏆 Weekly challenges with global leaderboard</li>
            <li>📈 Track your journey with personalized profiles</li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4 pt-6">
            <Link
              to="/problems"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.03]"
            >
              Start Solving
            </Link>
            <Link
              to="/contribute"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-50 dark:bg-transparent dark:border-blue-400 dark:text-blue-400 hover:dark:bg-blue-950 transition transform hover:scale-[1.03]"
            >
              Contribute to the Community
            </Link>
          </div>

          <div className="pt-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Why CodeXcel?
            </h2>
            <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
              CodeXcel isn't just a platform — it's a journey. Whether you're
              preparing for top tech interviews or building core logic skills,
              we’ve got your back.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src={studentSVG}
            alt="Student typing"
            className="w-full max-w-md mx-auto md:mx-0 drop-shadow-xl"
          />
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Trusted by Students from Top Institutes
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="text-gray-600 dark:text-gray-300 text-2xl">
            🎓 IIT
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-2xl">
            🧠 NIT
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-2xl">
            🚀 IIIT
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-2xl">
            📘 MIT
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-2xl">
            🌐 Global Coders
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
