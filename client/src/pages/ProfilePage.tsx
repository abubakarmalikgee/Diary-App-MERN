import React from "react";
// import { useAuthContext } from "../hooks/useAuthContext";
import { useGetProfile } from "../hooks/useGetProfile";

// interface User {
//   firstname: string;
//   lastname: string;
//   email: string;
//   role: string;
// }

const ProfilePage: React.FC = () => {
  //   const { authUser } = useAuthContext();
  //  //   const authUser: User = {
  //  //     firstname: "Abubakar",
  //  //     lastname: "Malik",
  //  //     email: "abubakar@gmail.com",
  //  //     role: "user",
  //  //   };
  //   if (!authUser) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  //         <h1 className="text-2xl font-semibold text-gray-800">
  //           Please log in to view your profile.
  //         </h1>
  //       </div>
  //     );
  //   }

  const { profile, loading, error } = useGetProfile();

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

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header Section */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-3xl">
            {profile.firstname.charAt(0).toUpperCase()}
            {profile.lastname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.firstname} {profile.lastname}
            </h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
            <span className="text-xs text-white bg-blue-500 px-3 py-1 rounded-full mt-2 inline-block">
              Role:{" "}
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
        </div>

        {/* User Stats Section */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Diaries
            </h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Calories Logged
            </h3>
            <p className="text-2xl font-bold text-yellow-600">19,500 kcal</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Exercise Time
            </h3>
            <p className="text-2xl font-bold text-green-600">18 hrs</p>
          </div>
          <div className="bg-indigo-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Water Intake
            </h3>
            <p className="text-2xl font-bold text-indigo-600">35 L</p>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">Walk Time</h3>
            <p className="text-2xl font-bold text-pink-600">6 hrs</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">Mood Logs</h3>
            <p className="text-2xl font-bold text-red-600">Positive</p>
          </div>
        </div>

        {/* User Notes */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
          <p className="text-gray-600 mt-2">
            Hi, I'm {profile.firstname}! I use this app to track my daily
            habits, manage my wellness, and improve my lifestyle. This space can
            include custom user content or a short description about them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
