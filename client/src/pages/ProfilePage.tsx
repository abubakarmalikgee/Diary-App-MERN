import React from "react";
import { useGetProfile } from "../hooks/useGetProfile";
import { useLogout } from "../hooks/useLogout";

const ProfilePage: React.FC = () => {
  const { profile, loading, error } = useGetProfile();
  const { logout } = useLogout();

  console.log(profile);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-red-600">{error}</h1>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">
          Please log in to view your profile.
        </h1>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    console.log("User logged out");
  };

  console.log(profile.since);

  const joinedDate = new Date(profile.since).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header Section */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-3xl">
            {profile.firstname.charAt(0).toUpperCase()}
            {profile.lastname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.firstname} {profile.lastname}
            </h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-1">Joined: {joinedDate}</p>
            <span className="text-xs text-white bg-green-500 px-3 py-1 rounded-full mt-2 inline-block">
              Role:{" "}
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
        </div>

        {/* About Me Section */}
        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
          <p className="text-gray-600 mt-2">
            Hi, I'm {profile.firstname}! I use this app to track my daily
            habits, manage my wellness, and improve my lifestyle. This space can
            include custom user content or a short description about them.
          </p>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-right">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
