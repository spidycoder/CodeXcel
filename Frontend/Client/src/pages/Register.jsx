import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    collegeName: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const {
      firstName,
      lastName,
      userName,
      email,
      collegeName,
      password,
      confirmPassword,
    } = formData;
    if (
      firstName == "" ||
      lastName == "" ||
      email == "" ||
      userName == "" ||
      collegeName == "" ||
      password == "" ||
      confirmPassword == ""
    ) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/register", formData);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/login";
      }
      setError("");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status == 400) {
          setError(message);
        } else if (status == 401) {
          setError("Password do not match");
        } else if (status == 409) {
          setError("Email already exists");
        } else if (status == 410) {
          setError("UserName already exists");
        }
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
          Register
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* firstname Field */}
          <div className="flex flex-col">
            <label
              htmlFor="firstName"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              First Name
            </label>
            <input
              type="firstName"
              id="firstName"
              name="firstName"
              placeholder="Aditya"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/* lastName Field */}
          <div className="flex flex-col">
            <label
              htmlFor="lastName"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Last Name
            </label>
            <input
              type="lastName"
              name="lastName"
              id="lastName"
              placeholder="Kumar"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/*UserName */}
          <div className="flex flex-col">
            <label
              htmlFor="userName"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              User Name
            </label>
            <input
              type="userName"
              id="userName"
              name="userName"
              placeholder="SpidyCoder"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
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
              name="email"
              id="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/* College Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="collegeName"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              College Name
            </label>
            <input
              type="collegeName"
              name="collegeName"
              id="collegeName"
              onChange={handleChange}
              placeholder="BIT MESREA"
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
              placeholder="••••••••"
              name="password"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/* Confirm Password Field */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              name="confirmPassword"
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}
          <div className="text-center text-gray-700 dark:text-white">
            Already registered?{" "}
            <Link to="/login" className="text-red-500 hover:underline">
              Login Now
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

export default Register;
