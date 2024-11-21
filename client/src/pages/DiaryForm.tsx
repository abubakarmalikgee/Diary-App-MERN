import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { postDiary } from "../features/diarySlice";

const DiaryForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.diary);

  const [date, setDate] = useState("");
  const [caloriesIntake, setCaloriesIntake] = useState<number | "">(0);
  const [energyLevel, setEnergyLevel] = useState<number | "">("");
  const [vitaminsTaken, setVitaminsTaken] = useState(false);
  const [mood, setMood] = useState("");
  const [exerciseTime, setExerciseTime] = useState<number | "">("");
  const [sleepQuality, setSleepQuality] = useState<number | "">("");
  const [waterIntake, setWaterIntake] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [walkTime, setWalkTime] = useState<number | "">("");
  const [stressLevel, setStressLevel] = useState<number | "">("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Adds leading zero if day is a single digit
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setDate(formattedDate);
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const diary = {
      date,
      caloriesIntake,
      energyLevel,
      vitaminsTaken,
      mood,
      exerciseTime,
      sleepQuality,
      waterIntake,
      notes,
      walkTime,
      stressLevel,
    };

    dispatch(postDiary(diary));

    console.log("Diary Submitted", diary);
  };

  const handleNumberInput = (value: string) => {
    const parsedValue = parseInt(value, 10);
    return parsedValue > 0 ? parsedValue : "";
  };

  return (
    <div
      className="grow w-full flex justify-center items-center py-14 bg-cover bg-center placeholder:text-gray-600"
      style={{
        backgroundImage: `url('/diary-bg.jpg')`,
      }}
    >
      <div className="w-full max-w-xl p-6 bg-white bg-opacity-5 backdrop-blur-md rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          New Diary Entry
        </h2>
        <p className="text-center text-white mb-4">Date: {date}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center ">
            {/* Calories Intake */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Calories Intake</span>
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
                <p className="text-red-500 text-sm">{errors.caloriesIntake}</p>
              )}
            </div>

            {/* Exercise Time */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">
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
                <span className="label-text text-white">
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
                <span className="label-text text-white">
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
              <span className="text-white text-sm text-center mt-1">
                {sleepQuality || "Select"}
              </span>
              {errors.sleepQuality && (
                <p className="text-red-500 text-sm">{errors.sleepQuality}</p>
              )}
            </div>

            {/* Energy Level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">
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
              <span className="text-white text-sm text-center mt-1">
                {energyLevel || "Select"}
              </span>
              {errors.energyLevel && (
                <p className="text-red-500 text-sm">{errors.energyLevel}</p>
              )}
            </div>

            {/* Stress Level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">
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
              <span className="text-white text-sm text-center mt-1">
                {stressLevel || "Select"}
              </span>
              {errors.stressLevel && (
                <p className="text-red-500 text-sm">{errors.stressLevel}</p>
              )}
            </div>

            {/* Walk Time */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">
                  Walk Time (minutes)
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter walk time"
                value={walkTime}
                onChange={(e) => setWalkTime(handleNumberInput(e.target.value))}
                className="input input-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
              />
              {errors.walkTime && (
                <p className="text-red-500 text-sm">{errors.walkTime}</p>
              )}
            </div>

            {/* Mood */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Mood</span>
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
                <span className="label-text text-white">Vitamins Taken</span>
                <input
                  type="checkbox"
                  checked={vitaminsTaken}
                  onChange={(e) => setVitaminsTaken(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Notes</span>
            </label>
            <textarea
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea textarea-bordered w-full bg-white bg-opacity-50 text-gray-800 placeholder:text-gray-600"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-block btn-primary text-white font-bold"
            disabled={loading}
          >
            {loading ? "Saving" : "Save Entry"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default DiaryForm;

// import { useDispatch, useSelector } from "react-redux";
// import { useState } from "react";
// import { postDiary } from "../features/diarySlice";
// import { RootState } from "../store/store"; // Adjust based on your store file location

// const DiaryForm = () => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state: RootState) => state.diaries);

//   // State for form fields
//   const [diary, setDiary] = useState({
//     caloriesIntake: "",
//     energyLevel: "",
//     vitaminsTaken: false,
//     mood: "",
//     exerciseTime: "",
//     sleepQuality: "",
//     waterIntake: "",
//     notes: "",
//     walkTime: "",
//     stressLevel: "",
//   });

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setDiary({
//       ...diary,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Post the new diary entry
//     dispatch(postDiary(diary));
//   };

//   return (
//     <div className="max-w-lg mx-auto">
//       <h2 className="text-xl font-semibold mb-4">Create New Diary</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="number"
//           name="caloriesIntake"
//           value={diary.caloriesIntake}
//           onChange={handleInputChange}
//           placeholder="Calories Intake"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           name="energyLevel"
//           value={diary.energyLevel}
//           onChange={handleInputChange}
//           placeholder="Energy Level"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="checkbox"
//           name="vitaminsTaken"
//           checked={diary.vitaminsTaken}
//           onChange={handleInputChange}
//           className="mr-2"
//         />
//         <label>Vitamins Taken</label>
//         <input
//           type="text"
//           name="mood"
//           value={diary.mood}
//           onChange={handleInputChange}
//           placeholder="Mood"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           name="exerciseTime"
//           value={diary.exerciseTime}
//           onChange={handleInputChange}
//           placeholder="Exercise Time (minutes)"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           name="sleepQuality"
//           value={diary.sleepQuality}
//           onChange={handleInputChange}
//           placeholder="Sleep Quality"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           name="waterIntake"
//           value={diary.waterIntake}
//           onChange={handleInputChange}
//           placeholder="Water Intake (liters)"
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="notes"
//           value={diary.notes}
//           onChange={handleInputChange}
//           placeholder="Notes"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           name="walkTime"
//           value={diary.walkTime}
//           onChange={handleInputChange}
//           placeholder="Walk Time (minutes)"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           name="stressLevel"
//           value={diary.stressLevel}
//           onChange={handleInputChange}
//           placeholder="Stress Level"
//           className="w-full p-2 border rounded"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full p-2 bg-blue-500 text-white rounded"
//         >
//           {loading ? "Saving..." : "Save Diary"}
//         </button>

//         {error && <p className="text-red-500">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default DiaryForm;
