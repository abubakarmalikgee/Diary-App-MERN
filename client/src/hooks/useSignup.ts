import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface SignupCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  const { setAuthUser } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        throw new Error(message || "Failed to register user.");
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

  return { signup, loading, error };
};
