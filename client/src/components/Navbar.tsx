import React, { useState } from "react";
import { FaList, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar: React.FC = () => {
  const { authUser } = useAuthContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-secondary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wide">
              My<span className="text-white">Diary</span>
            </Link>
          </div>

          {/* Navigation Links (Large screens) */}
          {!authUser ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/auth/login"
                className="hover:underline hover:text-gray-200 transition-all"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="hover:underline hover:text-gray-200 transition-all"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/diaries"
                className="hover:underline hover:text-gray-200 transition-all"
              >
                Diaries
              </Link>
              <Link
                to="/diary/log"
                className="hover:underline hover:text-gray-200 transition-all"
              >
                New Diary
              </Link>
              <Link
                to="/profile"
                className="hover:underline hover:text-gray-200 transition-all flex items-center gap-2"
              >
                Profile
                <FaUserCircle className="text-3xl" />
              </Link>
            </div>
          )}

          {/* Menu Icon (Small screens) */}
          {authUser && (
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-secondary hover:text-gray-200 focus:outline-none"
              >
                <FaList />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {authUser && isMenuOpen && (
        <div className="md:hidden bg-white text-primary px-4 py-3 shadow-md">
          <Link
            to="/diaries"
            className="block py-2 hover:bg-primary hover:text-white rounded-md transition-all"
          >
            Diaries
          </Link>
          <Link
            to="/diary/log"
            className="block py-2 hover:bg-primary hover:text-white rounded-md transition-all"
          >
            New Diary
          </Link>
          <Link
            to="/profile"
            className="block py-2 hover:bg-primary hover:text-white rounded-md transition-all"
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
