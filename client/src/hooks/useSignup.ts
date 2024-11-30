import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface SignupCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const signup = async (credentials: SignupCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const { message } = await response.json();
        toast.error(message);
        throw new Error(message || "Failed to register user.");
      }

      const data = await response.json();

      toast.success(data.message);
      navigate("/auth/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};
