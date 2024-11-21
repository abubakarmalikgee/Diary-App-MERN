import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Diary {
  id: string;
  date: string;
  caloriesIntake: number | "";
  energyLevel: number | "";
  vitaminsTaken: boolean;
  mood: string;
  exerciseTime: number | "";
  sleepQuality: number | "";
  waterIntake: number | "";
  notes: string;
  walkTime: number | "";
  stressLevel: number | "";
}

interface DiaryState {
  diaries: Diary[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DiaryState = {
  diaries: [],
  loading: false,
  error: null,
};

// Async thunk to fetch diaries from the backend
export const fetchDiaries = createAsyncThunk(
  "diaries/fetchDiaries",
  async () => {
    const response = await fetch("/api/v1/diary/all");
    const diaries = await response.json();
    return diaries.data as Diary[];
  }
);

// Async thunk to fetch diaries from the backend
export const fetchSingleDiary = createAsyncThunk(
  "diaries/fetchSingleDiary",
  async (diary: Diary) => {
    const response = await fetch(`/api/v1/diary/${diary.id}`);
    return (await response.json()) as Diary[];
  }
);

// Async thunk to post a new diary
export const postDiary = createAsyncThunk(
  "diaries/postDiary",
  async (newDiary: Omit<Diary, "id">) => {
    const response = await fetch("/api/v1/diary/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDiary),
    });
    return (await response.json()) as Diary;
  }
);

// Async thunk to update a diary
export const updateDiary = createAsyncThunk(
  "diaries/updateDiary",
  async (updatedDiary: Diary) => {
    const response = await fetch(`/api/v1/diary/${updatedDiary.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDiary),
    });
    const diary = await response.json();
    return { ...diary, id: diary._id } as Diary;
  }
);

// Async thunk to delete a diary
export const deleteDiary = createAsyncThunk(
  "diaries/deleteDiary",
  async (id: string) => {
    await fetch(`/api/v1/diary/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

// Slice
const diarySlice = createSlice({
  name: "diaries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Diaries
    builder.addCase(fetchDiaries.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDiaries.fulfilled, (state, action) => {
      state.loading = false;
      state.diaries = action.payload;
    });
    builder.addCase(fetchDiaries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch diaries";
    });

    // Post Diary
    builder.addCase(postDiary.fulfilled, (state, action) => {
      state.diaries.push(action.payload);
    });

    // Update Diary
    builder.addCase(updateDiary.fulfilled, (state, action) => {
      const index = state.diaries.findIndex(
        (diary) => diary.id === action.payload.id
      );
      if (index >= 0) {
        state.diaries[index] = action.payload;
      }
    });

    // Delete Diary
    builder.addCase(deleteDiary.fulfilled, (state, action) => {
      state.diaries = state.diaries.filter(
        (diary) => diary.id !== action.payload
      );
    });
  },
});

export default diarySlice.reducer;
