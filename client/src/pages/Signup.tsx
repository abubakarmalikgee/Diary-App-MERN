import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const Signup: React.FC = () => {
  const { loading, signup, error } = useSignup();

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateSignup = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate first name
    if (!firstname) {
      newErrors.firstName = "First Name is required.";
    }

    // Validate last name
    if (!lastname) {
      newErrors.lastName = "Last Name is required.";
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    return newErrors;
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignup();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await signup({ firstname, lastname, email, password });
    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="grow w-full flex justify-center items-center py-14 bg-cover bg-center">
      <div className="w-full max-w-sm p-6 bg-white bg-opacity-5 backdrop-blur-md rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold text-white mb-6 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.3)]">
          Create an Account
        </h2>
        <form className="" onSubmit={handleSignupSubmit}>
          {/* Full Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            />
            {errors.firstName && (
              <p className="text-error">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            />
            {errors.lastname && <p className="text-error">{errors.lastname}</p>}
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            />
            {errors.email && <p className="text-error">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            />
            {errors.password && <p className="text-error">{errors.password}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="btn btn-block btn-primary text-white font-bold mt-6"
            disabled={loading}
          >
            {loading ? "Signing Up" : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-primary font-semibold underline hover:text-primary-focus"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
