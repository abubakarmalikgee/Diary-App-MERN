import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { setAuthUser } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const { message } = await response.json();
        toast.error(message);
        throw new Error(message || "Failed to log in.");
      }

      const { message, data } = await response.json();
      localStorage.setItem("authUser", JSON.stringify(data));
      setAuthUser(data);
      toast.success(message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
