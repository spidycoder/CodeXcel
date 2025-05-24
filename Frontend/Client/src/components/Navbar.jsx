import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4997/4997543.png"
            alt="Logo"
            className="h-10 w-10"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-semibold text-gray-700 dark:text-white items-center">
          <Link to="/problems" className="hover:text-blue-600">
            Problems
          </Link>
          <Link to="/contribute" className="hover:text-blue-600">
            Contribute
          </Link>
          <Link to="/admin" className="hover:text-blue-600">
            Admin
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                👤 {user.userName}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-600">
              Login/Register
            </Link>
          )}
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

          {user ? (
            <>
              <Link to="/profile" className="block hover:text-blue-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left hover:text-blue-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" className="block hover:text-blue-600">
              Login/Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
