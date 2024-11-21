import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DiaryCard from "../components/DiaryCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiaries } from "../features/diarySlice";
import { AppDispatch, RootState } from "../store/store";

const DiariesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { diaries, loading, error } = useSelector(
    (state: RootState) => state.diary
  );

  const [filters, setFilters] = useState({ mood: "", energyLevel: "" });

  // Fetch diaries from the backend on component mount
  useEffect(() => {
    dispatch(fetchDiaries());
  }, [dispatch]);

  console.log(diaries);

  const filteredDiaries = diaries.filter((diary) => {
    const matchesMood = filters.mood
      ? diary.mood.toLowerCase().includes(filters.mood.toLowerCase())
      : true;
    const matchesEnergyLevel = filters.energyLevel
      ? diary.energyLevel === parseInt(filters.energyLevel, 10)
      : true;
    return matchesMood && matchesEnergyLevel;
  });

  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="grow container mx-auto px-4 py-8">
      {/* Filters Section */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {/* Mood Filter */}
          <input
            type="text"
            name="mood"
            value={filters.mood}
            onChange={handleFilterChange}
            placeholder="Filter by mood"
            className="border p-2 rounded"
          />
          {/* Energy Level Filter */}
          <input
            type="number"
            name="energyLevel"
            value={filters.energyLevel}
            onChange={handleFilterChange}
            placeholder="Filter by energy level"
            className="border p-2 rounded"
          />
        </div>
        {/* Create New Diary Button */}
        <Link to="/diary/log">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create New Diary
          </button>
        </Link>
      </div>

      {/* Diaries Section */}
      {loading ? (
        <div
          role="status"
          className="grow h-96 w-full flex items-center justify-center"
        >
          <svg
            aria-hidden="true"
            className="w-14 h-14 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading Diaries...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiaries.map((diary, index) => (
            <DiaryCard
              diary={diary}
              key={`${diary.mood}-${diary.energyLevel}-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiariesPage;
