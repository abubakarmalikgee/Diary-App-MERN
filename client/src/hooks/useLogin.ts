import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

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
      const response = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to log in.");
      }

      const user = await response.json();

      // Set the authenticated user in the context
      setAuthUser(user);

      // Save the user to localStorage for persistence
      localStorage.setItem("authUser", JSON.stringify(user));
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

  return { login, loading, error };
};
