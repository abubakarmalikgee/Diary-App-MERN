import { useState, useEffect } from "react";
import DiaryCard from "../components/DiaryCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiaries } from "../features/diarySlice";
import { AppDispatch, RootState } from "../store/store";
import Pagination from "../components/Pagination";
import { Filters } from "../types/diary";
import EditForm from "../components/EditForm";
import EmptyDiaryPage from "../components/EmptyDiaryPage";
import { FaTimes } from "react-icons/fa";

interface Diary {
  _id: string;
  date: Date;
  caloriesIntake: number;
  energyLevel: number;
  vitaminsTaken: boolean;
  mood: string;
  exerciseTime: number;
  sleepQuality: number;
  waterIntake: number;
  notes: string;
  walkTime: number;
  stressLevel: number;
}

const DiariesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { diaries, totalDiaries, loading, error, totalPages } = useSelector(
    (state: RootState) => state.diary
  );

  const [edit, setEdit] = useState(false);
  const [diaryToEdit, setDiaryToEdit] = useState<Diary | null>(null);
  const [openFilter, setOpenFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("desc");
  const [filters, setFilters] = useState({
    mood: "",
    energyLevel: 0,
    caloriesIntake: 0,
    waterIntake: 0,
    exerciseTime: 0,
    walkTime: 0,
    sleepQuality: 0,
    stressLevel: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(
      fetchDiaries({
        page,
        sort: `${order === "desc" ? "-" : ""}${sort}`,
        filters,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, sort, order]);

  const handlePageChange = (page: number) => {
    setPage(page);
    document.body.scrollTop = 100;
    document.documentElement.scrollTop = 100;
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value); // Update the sort field
  };

  const toggleSortOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleGetFilteredDiary = (filter: Filters) => {
    setPage(1);
    const transformedFilters: Record<string, string | number | Date> =
      Object.fromEntries(
        Object.entries(filter).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            (typeof value === "string" ||
              typeof value === "number" ||
              value instanceof Date)
        )
      );
    dispatch(
      fetchDiaries({
        page,
        sort: `${order === "desc" ? "-" : ""}${sort}`,
        filters: transformedFilters,
      })
    );
  };

  const handleFilterReset = () => {
    setFilters({
      mood: "",
      energyLevel: 0,
      caloriesIntake: 0,
      waterIntake: 0,
      exerciseTime: 0,
      walkTime: 0,
      sleepQuality: 0,
      stressLevel: 0,
      startDate: "",
      endDate: "",
    });
    setPage(1);

    dispatch(
      fetchDiaries({
        page,
        sort: `${order === "desc" ? "-" : ""}${sort}`,
        filters,
      })
    );
  };

  const handleCloseFilter = () => {
    setFilters({
      mood: "",
      energyLevel: 0,
      caloriesIntake: 0,
      waterIntake: 0,
      exerciseTime: 0,
      walkTime: 0,
      sleepQuality: 0,
      stressLevel: 0,
      startDate: "",
      endDate: "",
    });
    setOpenFilters(false);
  };

  const handlCloseEditModal = (status: boolean) => {
    setEdit(status);
  };

  const handleOpenEditModal = (diary: Diary, status: boolean) => {
    setDiaryToEdit(diary);
    setEdit(status);
  };

  return (
    <div className="grow container flex flex-col items-center relative md:p-6 p-3">
      <EditForm diary={diaryToEdit} show={edit} onEdit={handlCloseEditModal} />
      {/* Filters Section */}

      <DiaryFilter
        openFilterBox={handleCloseFilter}
        filters={filters}
        checkOpenFilter={openFilter}
        handleGetFilterDiary={handleGetFilteredDiary}
      />

      {
        <div className="flex items-center w-full flex-col-reverse md:flex-row gap-6 justify-between py-6 mb-6">
          <p className="text-xl font-bold text-white">
            Total Diaries:{" "}
            <span className="text-primary text-3xl">{totalDiaries}</span>
          </p>
          {/* Filter and Sorting Section */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOpenFilters(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Filters
            </button>
            <button
              onClick={() => handleFilterReset()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reset filters
            </button>
            <select
              value={sort}
              onChange={handleSortChange}
              className="border p-2 rounded"
            >
              <option value="date">Sort by Date</option>
              <option value="mood">Sort by Mood</option>
              <option value="energyLevel">Sort by Energy Level</option>
              <option value="title">Sort by Title</option>
              <option value="createdBy">Sort by Author</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className={`px-4 py-2 rounded ${
                order === "asc" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {order === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>
      }

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
        <p className="text-red-500 text-4xl font-semibold">{error}</p>
      ) : diaries.length === 0 ? (
        <EmptyDiaryPage />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
          {diaries.map((diary, index) => (
            <DiaryCard
              diary={diary}
              onEdit={handleOpenEditModal}
              key={`${diary.mood}-${diary.energyLevel}-${index}`}
            />
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex w-full items-center justify-center p-4 pt-10">
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          setPage={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DiariesPage;

interface DiaryFilterProps {
  // filterChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  openFilterBox: () => void;
  filters: Filters;
  checkOpenFilter: boolean;
  handleGetFilterDiary: (filter: Filters) => void;
}

const DiaryFilter: React.FC<DiaryFilterProps> = ({
  openFilterBox,
  filters,
  checkOpenFilter,
  handleGetFilterDiary,
}) => {
  const [filter, setFilter] = useState(filters);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div
      className={`bg-orange-200 p-4 shadow-md rounded-md mb-6 bg-opacity-50 backdrop-blur-sm fixed top-20 left-0 right-0 m-auto z-50 container ${
        checkOpenFilter ? "" : "hidden"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <button onClick={() => openFilterBox()}>
          <FaTimes className="text-2xl" />
        </button>
      </div>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar">
        {/* Mood Filter */}
        <div>
          <label
            htmlFor="mood"
            className="block text-sm font-medium text-gray-700"
          >
            Mood
          </label>
          <select
            name="mood"
            value={filter.mood}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Mood</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="neutral">Neutral</option>
            <option value="excited">Excited</option>
            <option value="anxious">Anxious</option>
            <option value="tired">Tired</option>
          </select>
        </div>

        {/* Energy Level Filter */}
        <div>
          <label
            htmlFor="energyLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Energy Level
          </label>
          <input
            type="range"
            name="energyLevel"
            value={filter.energyLevel}
            onChange={handleFilterChange}
            min="1"
            max="10"
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Current: {filter.energyLevel}
          </p>
        </div>

        {/* Calories Intake Filter */}
        <div>
          <label
            htmlFor="caloriesIntake"
            className="block text-sm font-medium text-gray-700"
          >
            Calories Intake
          </label>
          <input
            type="number"
            name="caloriesIntake"
            value={filter.caloriesIntake}
            onChange={handleFilterChange}
            placeholder="Enter calories"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Water Intake Filter */}
        <div>
          <label
            htmlFor="waterIntake"
            className="block text-sm font-medium text-gray-700"
          >
            Water Intake (L)
          </label>
          <input
            type="number"
            name="waterIntake"
            value={filter.waterIntake}
            onChange={handleFilterChange}
            placeholder="Enter water intake"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Exercise Time Filter */}
        <div>
          <label
            htmlFor="exerciseTime"
            className="block text-sm font-medium text-gray-700"
          >
            Exercise Time (mins)
          </label>
          <input
            type="number"
            name="exerciseTime"
            value={filter.exerciseTime}
            onChange={handleFilterChange}
            placeholder="Enter exercise time"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Walk Time Filter */}
        <div>
          <label
            htmlFor="walkTime"
            className="block text-sm font-medium text-gray-700"
          >
            Walk Time (mins)
          </label>
          <input
            type="number"
            name="walkTime"
            value={filter.walkTime}
            onChange={handleFilterChange}
            placeholder="Enter walk time"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Sleep Quality Filter */}
        <div>
          <label
            htmlFor="sleepQuality"
            className="block text-sm font-medium text-gray-700"
          >
            Sleep Quality
          </label>
          <input
            type="range"
            name="sleepQuality"
            value={filter.sleepQuality}
            onChange={handleFilterChange}
            min="1"
            max="10"
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Current: {filter.sleepQuality}
          </p>
        </div>

        {/* Stress Level Filter */}
        <div>
          <label
            htmlFor="stressLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Stress Level
          </label>
          <input
            type="range"
            name="stressLevel"
            value={filter.stressLevel}
            onChange={handleFilterChange}
            min="1"
            max="10"
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Current: {filter.stressLevel}
          </p>
        </div>

        {/* Date Range Filters */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-4">
        <button
          onClick={() => handleGetFilterDiary(filter)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
