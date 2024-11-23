import { Diary } from "../types/diary";

// Props type
interface DiaryCardProps {
  diary: Diary;
  index: number;
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

const DiaryCard: React.FC<DiaryCardProps> = ({ diary }) => {
  const { day, month, year, time } = formatDate(new Date(diary.date));
  return (
    <div className="bg-orange-200 bg-opacity-70 backdrop-blur-sm border border-orange-200 rounded-xl shadow-xl overflow-hidden">
      {/* Date Section */}
      <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-3xl m-6 rounded-lg px-4 py-6 overflow-hidden">
        <div className="text-primary font-bold">
          <span className="text-6xl leading-none drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
            {day}
          </span>
          <span className="text-sm mt-1 text-gray-700">
            &nbsp; {month} {year}, {time}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {/* <div className="text-sm font-bold text-primary drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
            Mood:
          </div> */}
          <div className="h-full justify-self-end badge badge-lg badge-accent">{diary.mood}</div>
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
      <div className="mt-4 bg-gray-100 bg-opacity-25 backdrop-blur-2xl p-4 rounded-lg mx-6 mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
        <p className="text-sm text-gray-700">
          {diary.notes || "No additional notes provided."}
        </p>
      </div>
    </div>
  );
};

export default DiaryCard;
