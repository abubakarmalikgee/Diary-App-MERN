import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

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

interface DiaryState {
  diaries: Diary[];
  loading: boolean;
  error: string | null;
  totalDiaries: number; // Total diaries available for pagination
  currentPage: number; // Current page for pagination
  totalPages: number; // Total number of pages
}

// Initial state
const initialState: DiaryState = {
  diaries: [],
  loading: false,
  error: null,
  totalDiaries: 0,
  currentPage: 1,
  totalPages: 0,
};

// Async thunk to fetch diaries with filters, sorting, and pagination
export const fetchDiaries = createAsyncThunk(
  "diaries/fetchDiaries",
  async ({
    page,
    sort,
    filters,
  }: {
    page: number;
    sort: string;
    filters: Record<string, string | number | Date>;
  }) => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) =>
          value !== "" && value !== undefined && value !== null && value !== 0
      )
    );

    const params = new URLSearchParams({
      page: page.toString(),
      sort,
      ...validFilters, // Only include valid filters
    });

    const response = await fetch(`/api/v1/diary/all?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diaries");
    }
    const { data, count } = await response.json();
    return { diaries: data as Diary[], count };
  }
);

// Async thunk to post a new diary
export const postDiary = createAsyncThunk(
  "diaries/postDiary",
  async (newDiary: Omit<Diary, "_id">) => {
    const response = await fetch("/api/v1/diary/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDiary),
    });
    if (!response.ok) {
      throw new Error("Failed to create a new diary");
    }
    const res = await response.json();
    return res.data as Diary;
  }
);

// Async thunk to update a diary
export const updateDiary = createAsyncThunk(
  "diaries/updateDiary",
  async (updatedDiary: Diary) => {
    console.log(updateDiary);
    const response = await fetch(`/api/v1/diary/${updatedDiary._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDiary),
    });
    if (!response.ok) {
      throw new Error("Failed to update the diary");
    }
    const { message, data } = await response.json();
    toast.success(message);
    return { ...data } as Diary;
  }
);

// Async thunk to delete a diary
export const deleteDiary = createAsyncThunk(
  "diaries/deleteDiary",
  async (id: string) => {
    const response = await fetch(`/api/v1/diary/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete the diary");
    }
    const { message } = await response.json();
    toast.success(message);
    return id;
  }
);

// Slice
const diarySlice = createSlice({
  name: "diaries",
  initialState,
  reducers: {
    // Action to change the current page
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Diaries
    builder.addCase(fetchDiaries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDiaries.fulfilled, (state, action) => {
      state.loading = false;
      state.diaries = action.payload.diaries;
      state.totalDiaries = action.payload.count;
      state.totalPages = Math.ceil(action.payload.count / 10);
    });
    builder.addCase(fetchDiaries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch diaries";
    });

    // Post Diary
    builder.addCase(postDiary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(postDiary.fulfilled, (state, action) => {
      state.loading = false;
      state.diaries.push(action.payload);
      toast.success("New diary created.");
    });
    builder.addCase(postDiary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create a diary";
      toast.error("Failed to create a diary");
    });

    // Update Diary
    builder.addCase(updateDiary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDiary.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.diaries.findIndex(
        (diary) => diary._id === action.payload._id
      );
      if (index >= 0) {
        state.diaries[index] = action.payload;
      }
    });
    builder.addCase(updateDiary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update the diary";
    });

    // Delete Diary
    builder.addCase(deleteDiary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDiary.fulfilled, (state, action) => {
      state.loading = false;
      state.diaries = state.diaries.filter(
        (diary) => diary._id !== action.payload
      );
      state.totalDiaries -= 1; // Decrement the total diary count
      state.totalPages = Math.ceil(state.totalDiaries / 10); // Recalculate total pages
    });
    builder.addCase(deleteDiary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete the diary";
    });
  },
});

// Export actions and reducer
export const { setCurrentPage } = diarySlice.actions;
export default diarySlice.reducer;
