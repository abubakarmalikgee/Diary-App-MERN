import React from "react";

const EmptyDiaryPage: React.FC = () => {
  return (
    <div className="flex flex-col w-fit px-10 py-10 my-4 items-center justify-center h-full text-center gap-6 backdrop-blur-sm rounded-md shadow-md shadow-orange-700">
      {/* Illustration or Icon */}
      <img
        src="/emptydiary.svg"
        alt="No Diaries"
        className="w-56 object-cover"
      />

      {/* Message */}
      <h2 className="text-2xl font-semibold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
        No Diaries Found
      </h2>
    </div>
  );
};

export default EmptyDiaryPage;
