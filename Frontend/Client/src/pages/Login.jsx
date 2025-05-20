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

    if (email === "" || password === "") {
      setError("All fields are required");
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
        console.log("User's Infro from Frontend from login's page",userData);
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status === 400) {
          setError(message);
        } else if (status === 401) {
          setError("Incorrect password");
        } else {
          setError("Something went wrong. Please try again.");
        }
        console.error("Server responded with error:", message);
      } else {
        setError("Network error. Please check your connection.");
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Log In
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Log In
          </button>
          {error && <div className="text-red-500">{error}</div>}
          {/* Register Link */}
          <div className="text-center text-gray-700 dark:text-white">
            New User?{" "}
            <Link to="/register" className="text-red-500 hover:underline">
              Register Now
            </Link>
          </div>

          {/* Google Log In */}
          {/* <button
            type="button"
            className="w-full bg-white dark:bg-gray-700 text-black dark:text-white py-2 rounded-md border flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <span>Log In with Google</span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              height={20}
              width={20}
              alt="Google"
            />
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
