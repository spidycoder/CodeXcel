import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import codeXcel from "../assets/codeXcel.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setShowDropdown(false);
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-extrabold text-2xl select-none"
          >
            <img
              src={codeXcel}
              alt="CodeXcel Logo"
              className="h-15 w-15 rounded-full shadow-md"
            />
            CodeXcel
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-gray-300">
            <Link
              to="/problems"
              className="hover:text-white transition-colors duration-200"
            >
              Problems
            </Link>
            <Link
              to="/contribute"
              className="hover:text-white transition-colors duration-200"
            >
              Contribute
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-white transition-colors duration-200"
            >
              Leaderboard
            </Link>
            <Link
              to="/admin"
              className="hover:text-white transition-colors duration-200"
            >
              Admin
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <span
                    aria-label="user icon"
                    role="img"
                    className="text-xl select-none"
                  >
                    👤
                  </span>
                  <span>{user.userName}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <Link
                      to={`/profile/${user.userName}`}
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-gray-800 hover:bg-indigo-600 hover:text-white transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-indigo-600 hover:text-white transition"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md"
              aria-label="Toggle menu"
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 text-gray-300 transition-max-height duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-5 pt-4 pb-6 space-y-4 flex flex-col">
          <Link
            to="/problems"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition"
          >
            Problems
          </Link>
          <Link
            to="/contribute"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition"
          >
            Contribute
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition"
          >
            Leaderboard
          </Link>
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition"
          >
            Admin
          </Link>

          {user ? (
            <>
              <Link
                to={`/profile/${user.userName}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
