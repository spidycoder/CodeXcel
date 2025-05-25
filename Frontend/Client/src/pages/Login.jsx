import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/login", formData);
      if (res.status === 200) {
        const userData = {
          token: res.data.token,
          userName: res.data.userName,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User Info:", userData);
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) setError(data);
        else if (status === 401) setError("Incorrect password.");
        else setError("Something went wrong. Please try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Welcome Back 👋
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-gray-500 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-gray-500 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Log In
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm transition-all">
              <span className="text-lg">⚠️</span>
              <p className="flex-1">{error}</p>
            </div>
          )}

          {/* Link to Register */}
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            New user?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register Now
            </Link>
          </p>

          {/* Google Login (Optional) */}
          {/* 
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 mt-2 border rounded-md py-2 bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              height={20}
              width={20}
              alt="Google"
            />
            <span>Log In with Google</span>
          </button>
          */}
        </form>
      </div>
    </div>
  );
};

export default Login;
