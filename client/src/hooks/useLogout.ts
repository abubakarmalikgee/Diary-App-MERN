import toast from "react-hot-toast";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { setAuthUser } = useAuthContext();

  const logout = () => {
    // Clear the authenticated user from the context
    setAuthUser(null);

    // Remove the user from localStorage
    localStorage.removeItem("authUser");

    // Optionally, handle backend logout (e.g., token invalidation)
    fetch("/api/v1/user/logout", { method: "POST" }).catch((err) => {
      console.error("Failed to log out from the backend:", err);
      toast.error("Failed to logout");
    });
  };

  return { logout };
};
