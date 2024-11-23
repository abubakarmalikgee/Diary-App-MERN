import { useState, useEffect } from "react";
import axios from "axios";

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  since: Date;
}

export const useGetProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching data
      try {
        const response = await axios.get("/api/v1/user/me");
        setProfile(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Run this only once on component mount

  return { profile, loading, error };
};
