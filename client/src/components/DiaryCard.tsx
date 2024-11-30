import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store"; // Adjust the import based on your store setup
import { deleteDiary } from "../features/diarySlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Diary } from "../types/diary";

interface DiaryCardProps {
  diary: Diary;
  onEdit: (diary: Diary, status: boolean) => void; // Callback for handling edit
}

// Helper function to format the date
const formatDate = (date: Date) => {
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return { day, month, year, time };
};

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.diary);
  const { day, month, year, time } = formatDate(new Date(diary.date));

  // Handle delete action
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this diary?")) {
      dispatch(deleteDiary(diary._id));
    }
  };

  return (
    <div className="bg-orange-200 bg-opacity-70 h-[570px] backdrop-blur-sm border border-orange-200 rounded-xl shadow-xl overflow-hidden">
      {/* Date Section */}
      <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-3xl m-6 rounded-lg px-4 py-6 overflow-hidden">
        <div className="text-primary font-bold">
          <span className="text-6xl leading-none drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
            {day}
          </span>
          <span className="text-sm text-gray-700">
            &nbsp; {month} {year}
            <br />
            &nbsp; {time}
          </span>
        </div>
        <div className="flex flex-col-reverse items-center gap-4">
          <div className="badge badge-lg badge-accent">{diary.mood}</div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => onEdit(diary, true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
              disabled={loading}
            >
              {loading ? "..." : <FaTrash size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Diary Details */}
      <div className="mt-4 space-y-3 px-6">
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Calories Intake:</span>
          <span className="text-gray-800">{diary.caloriesIntake} kcal</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Energy Level:</span>
          <span className="text-gray-800">{diary.energyLevel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Exercise Time:</span>
          <span className="text-gray-800">{diary.exerciseTime} mins</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Sleep Quality:</span>
          <span className="text-gray-800">{diary.sleepQuality} / 10</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Water Intake:</span>
          <span className="text-gray-800">{diary.waterIntake} L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Walk Time:</span>
          <span className="text-gray-800">{diary.walkTime} mins</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Stress Level:</span>
          <span className="text-gray-800">{diary.stressLevel}</span>
        </div>
      </div>

      {/* Notes Section */}
      <div className="absolute bottom-0 left-0 h-28 w-[calc(100%-48px)] cursor-pointer bg-gray-100 bg-opacity-25 backdrop-blur-3xl p-4 rounded-lg mx-6 mb-6 hover:overflow-y-scroll overflow-y-hidden hover:absolute hover:bottom-0 hover:h-[370px] hover:bg-opacity-80 hover:bg-orange-100 transition-all duration-500 scrollbar">
        <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {diary.notes || "No additional notes provided."}
        </p>
      </div>
    </div>
  );
};

export default DiaryCard;
