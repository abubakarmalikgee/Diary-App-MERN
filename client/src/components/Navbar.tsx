import React, { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar: React.FC = () => {
  const { authUser } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-orange-200 bg-opacity-25 backdrop-blur-sm text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            My<span className="text-yellow-300">Diary</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {!authUser ? (
              <>
                <Link
                  to="/auth/login"
                  className="hover:underline hover:text-yellow-300 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="hover:underline hover:text-yellow-300 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/diaries"
                  className="hover:underline hover:text-yellow-300 transition duration-200"
                >
                  Diaries
                </Link>
                <Link
                  to="/diary/log"
                  className="hover:underline hover:text-yellow-300 transition duration-200"
                >
                  New Diary
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:underline hover:text-yellow-300 transition duration-200"
                >
                  <FaUserCircle className="text-2xl" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && authUser && (
        <div className="md:hidden bg-black bg-opacity-35 text-white py-4 shadow-lg">
          <Link
            to="/diaries"
            className="block py-3 px-3 hover:bg-primary bg-opacity-30 rounded-md transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Diaries
          </Link>
          <Link
            to="/diary/log"
            className="block py-3 px-3 hover:bg-primary bg-opacity-30 rounded-md transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            New Diary
          </Link>
          <Link
            to="/profile"
            className="block py-3 px-3 hover:bg-primary bg-opacity-30 rounded-md transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
        </div>
      )}

      {!authUser && isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-35 text-white py-4 shadow-lg">
          <Link
            to="/auth/login"
            className="block py-3 px-3 hover:bg-primary bg-opacity-30 rounded-md transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="block py-3 px-3 hover:bg-primary bg-opacity-30 rounded-md transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
