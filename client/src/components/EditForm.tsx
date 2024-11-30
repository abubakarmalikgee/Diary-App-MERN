/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { updateDiary } from "../features/diarySlice";
import { Diary } from "../types/diary";

interface EditFormProps {
  diary: Diary | null;
  show: boolean;
  onEdit: (status: boolean) => void;
}

const EditForm: React.FC<EditFormProps> = ({ diary, show, onEdit }) => {
  if (!diary) {
    return null;
  } else {
    const dispatch: AppDispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.diary);

    const [date, setDate] = useState<Date | null>(null);
    const [caloriesIntake, setCaloriesIntake] = useState<number>(0);
    const [energyLevel, setEnergyLevel] = useState<number>(0);
    const [vitaminsTaken, setVitaminsTaken] = useState(false);
    const [mood, setMood] = useState("");
    const [exerciseTime, setExerciseTime] = useState<number>(0);
    const [sleepQuality, setSleepQuality] = useState<number>(0);
    const [waterIntake, setWaterIntake] = useState<number>(0);
    const [notes, setNotes] = useState("");
    const [walkTime, setWalkTime] = useState<number>(0);
    const [stressLevel, setStressLevel] = useState<number>(0);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
      if (diary) {
        setDate(diary.date);
        setCaloriesIntake(diary.caloriesIntake);
        setEnergyLevel(diary.energyLevel);
        setVitaminsTaken(diary.vitaminsTaken);
        setMood(diary.mood);
        setExerciseTime(diary.exerciseTime);
        setSleepQuality(diary.sleepQuality);
        setWaterIntake(diary.waterIntake);
        setNotes(diary.notes);
        setWalkTime(diary.walkTime);
        setStressLevel(diary.stressLevel);
      }
    }, [diary]);

    const validate = () => {
      const newErrors: { [key: string]: string } = {};
      if (!caloriesIntake)
        newErrors.caloriesIntake = "Calories intake is required.";
      if (!energyLevel) newErrors.energyLevel = "Energy level is required.";
      if (!mood) newErrors.mood = "Mood is required.";
      if (!exerciseTime) newErrors.exerciseTime = "Exercise time is required.";
      if (!sleepQuality) newErrors.sleepQuality = "Sleep quality is required.";
      if (!waterIntake) newErrors.waterIntake = "Water intake is required.";
      if (!walkTime) newErrors.walkTime = "Walk time is required.";
      if (!stressLevel) newErrors.stressLevel = "Stress level is required.";
      return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const updatedDiary = {
        _id: diary._id,
        date: diary.date,
        caloriesIntake,
        energyLevel,
        vitaminsTaken,
        mood: mood.toLowerCase(),
        exerciseTime,
        sleepQuality,
        waterIntake,
        notes,
        walkTime,
        stressLevel,
      };

      await dispatch(updateDiary(updatedDiary));
      console.log("Diary Updated", updatedDiary);
      onEdit(false);
    };

    const handleNumberInput = (value: string) => {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) || parsedValue <= 0 ? 0 : parsedValue;
    };

    const formatDateInput = (date: string | Date) => {
      if (typeof date === "string") {
        date = new Date(date);
      }
      console.log("Parsed date:", date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date provided.");
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return (
      <div
        className={`fixed inset-0 z-50 ${
          show ? "flex" : "hidden"
        } items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}
      >
        <div className="relative w-full max-w-2xl max-h-[90vh] p-6 bg-white bg-opacity-60 backdrop-blur-lg rounded-lg shadow-md overflow-hidden">
          <h2 className="text-center text-3xl font-bold text-primary drop-shadow-[0_0_10px_white] mb-6">
            Edit Diary Entry
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 overflow-y-auto"
            style={{ maxHeight: "70vh" }}
          >
            {/* Date Picker */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Date</span>
              </label>
              <input
                type="date"
                value={date ? formatDateInput(date) : ""}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
                disabled
              />
            </div>
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center ">
              {/* Calories Intake */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Calories Intake</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter calories intake"
                  value={caloriesIntake}
                  onChange={(e) =>
                    setCaloriesIntake(handleNumberInput(e.target.value))
                  }
                  className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
                />
                {errors.caloriesIntake && (
                  <p className="text-red-500 text-sm">
                    {errors.caloriesIntake}
                  </p>
                )}
              </div>

              {/* Exercise Time */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">
                    Exercise Time (minutes)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter exercise time"
                  value={exerciseTime}
                  onChange={(e) =>
                    setExerciseTime(handleNumberInput(e.target.value))
                  }
                  className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
                />
                {errors.exerciseTime && (
                  <p className="text-red-500 text-sm">{errors.exerciseTime}</p>
                )}
              </div>

              {/* Water Intake */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">
                    Water Intake (liters)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter water intake"
                  value={waterIntake}
                  onChange={(e) =>
                    setWaterIntake(handleNumberInput(e.target.value))
                  }
                  className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
                />
                {errors.waterIntake && (
                  <p className="text-red-500 text-sm">{errors.waterIntake}</p>
                )}
              </div>

              {/* Sleep Quality */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">
                    Sleep Quality (1-10)
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="range range-primary bg-orange-200"
                />
                <span className="text-black text-sm text-center mt-1">
                  {sleepQuality || "Select"}
                </span>
                {errors.sleepQuality && (
                  <p className="text-red-500 text-sm">{errors.sleepQuality}</p>
                )}
              </div>

              {/* Energy Level */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">
                    Energy Level (1-10)
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="range range-primary bg-orange-200"
                />
                <span className="text-black text-sm text-center mt-1">
                  {energyLevel || "Select"}
                </span>
                {errors.energyLevel && (
                  <p className="text-red-500 text-sm">{errors.energyLevel}</p>
                )}
              </div>

              {/* Stress Level */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">
                    Stress Level (1-10)
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="range range-primary bg-orange-200"
                />
                <span className="text-black text-sm text-center mt-1">
                  {stressLevel || "Select"}
                </span>
                {errors.stressLevel && (
                  <p className="text-red-500 text-sm">{errors.stressLevel}</p>
                )}
              </div>

              {/* Walk Time */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">
                    Walk Time (minutes)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter walk time"
                  value={walkTime}
                  onChange={(e) =>
                    setWalkTime(handleNumberInput(e.target.value))
                  }
                  className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
                />
                {errors.walkTime && (
                  <p className="text-red-500 text-sm">{errors.walkTime}</p>
                )}
              </div>

              {/* Mood */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Mood</span>
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="select select-bordered bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
                >
                  <option value="" disabled>
                    Select mood
                  </option>
                  <option>Happy</option>
                  <option>Sad</option>
                  <option>Neutral</option>
                  <option>Anxious</option>
                  <option>Excited</option>
                  <option>Tired</option>
                </select>
                {errors.mood && (
                  <p className="text-red-500 text-sm">{errors.mood}</p>
                )}
              </div>

              {/* Vitamins Taken */}
              <div className="form-control">
                <label className="label cursor-pointer w-36">
                  <span className="label-text text-black">Vitamins Taken</span>
                  <input
                    type="checkbox"
                    checked={vitaminsTaken}
                    onChange={() => setVitaminsTaken((prev) => !prev)}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Notes</span>
              </label>
              <textarea
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="textarea textarea-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
              ></textarea>
            </div>
            <div>
              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-block btn-primary text-black font-bold"
                disabled={loading}
              >
                {loading ? "Updating" : "Update Entry"}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    );
  }
};

export default EditForm;
