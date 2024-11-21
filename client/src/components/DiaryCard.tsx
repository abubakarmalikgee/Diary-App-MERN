import { Diary } from "../types/diary";

// Props type
interface DiaryCardProps {
  diary: Diary;
  index: number;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, index }) => {
  return (
    <div>
      <div key={index} className="bg-white p-4 rounded-lg shadow-md">
        {/* Date Section */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-3xl font-semibold">
              {diary.date.split("-")[0]}
            </span>
            <div className="text-base text-gray-500">{`${
              diary.date.split("-")[1]
            }-${diary.date.split("-")[2]}`}</div>
          </div>
        </div>

        {/* Diary Details */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Calories Intake:</span>
            <span>{diary.caloriesIntake} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Energy Level:</span>
            <span>{diary.energyLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Mood:</span>
            <span>{diary.mood}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Exercise Time:</span>
            <span>{diary.exerciseTime} mins</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Sleep Quality:</span>
            <span>{diary.sleepQuality} / 10</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Water Intake:</span>
            <span>{diary.waterIntake} L</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Walk Time:</span>
            <span>{diary.walkTime} mins</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Stress Level:</span>
            <span>{diary.stressLevel}</span>
          </div>
          {/* Notes */}
          <div className="mt-2 text-sm text-gray-600">{diary.notes}</div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;
