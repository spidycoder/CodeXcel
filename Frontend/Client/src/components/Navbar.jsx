import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4997/4997543.png"
            alt="Logo"
            className="h-10 w-10"
          />
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-semibold text-gray-700 dark:text-white">
          <Link to="/problems" className="hover:text-blue-600">
            Problems
          </Link>
          <Link to="/contribute" className="hover:text-blue-600">
            Contribute
          </Link>
          <Link to="/admin" className="hover:text-blue-600">
            Admin
          </Link>
          <Link to="/login" className="hover:text-blue-600">
            Login/Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 px-4 space-y-2 text-gray-700 dark:text-white">
          <Link to="/problems" className="block hover:text-blue-600">
            Problems
          </Link>
          <Link to="/contribute" className="block hover:text-blue-600">
            Contribute
          </Link>
          <Link to="/admin" className="block hover:text-blue-600">
            Admin
          </Link>
          <Link to="/login" className="block hover:text-blue-600">
            Login/Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
