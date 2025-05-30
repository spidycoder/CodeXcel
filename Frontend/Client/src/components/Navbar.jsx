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
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4997/4997543.png"
            alt="Logo"
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            CodeHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-base font-medium text-gray-700 dark:text-white">
          <Link to="/problems" className="hover:text-blue-600 transition">
            Problems
          </Link>
          <Link to="/contribute" className="hover:text-blue-600 transition">
            Contribute
          </Link>
          <Link to="/leaderboard" className="block hover:text-blue-600">
            Leaderboard
          </Link>
          <Link to="/admin" className="hover:text-blue-600 transition">
            Admin
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <span role="img" aria-label="user">
                  👤
                </span>{" "}
                {user.userName}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg py-1 transition-all duration-150">
                  <Link
                    to={`/profile/${user.userName}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-blue-600 transition duration-150"
            >
              Login / Register
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
              className="w-7 h-7"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-6 pt-4 pb-6 space-y-3 text-gray-700 dark:text-white">
          <Link to="/problems" className="block hover:text-blue-600">
            Problems
          </Link>

          <Link to="/contribute" className="block hover:text-blue-600">
            Contribute
          </Link>
          <Link to="/leaderboard" className="block hover:text-blue-600">
            Leaderboard
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
                className="block w-full text-left hover:text-blue-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" className="block hover:text-blue-600">
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
