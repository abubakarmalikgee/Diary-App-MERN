import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const { loading, login, error } = useLogin();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};
    // Validate email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }
    // Validate password
    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await login({ email, password });

    if (error) {
      toast.error(error);
    }

    // Login logic here
    console.log({ email, password });
  };

  return (
    <div
      className="grow w-full flex justify-center items-center py-14 bg-cover bg-center placeholder:text-gray-600"
      style={{
        backgroundImage: `url('/login-bg.jpg')`,
      }}
    >
      <div className="w-full max-w-sm p-6 bg-white bg-opacity-5 backdrop-blur-md rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Welcome Back
        </h2>
        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            />
            {errors.email && <p>{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            />
            {errors.password && <p>{errors.password}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-block btn-primary text-white font-bold"
            disabled={loading}
          >
            {loading ? "Logging In" : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-white">
          Don’t have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-primary font-semibold underline hover:text-primary-focus"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
