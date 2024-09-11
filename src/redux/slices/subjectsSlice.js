import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCategories,
  createNewCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

export const fetchAllSubjects = createAsyncThunk(
  "subjects/fetchAllCategories",
  async ({ orderBy, descending }, thunkAPI) => {
    const res = await fetchAllCategories({ orderBy, descending });
    return res;
  }
);
export const createNewSubject = createAsyncThunk(
  "subjects/createNewSubject",
  async (name, thunkAPI) => {
    const res = await createNewCategory(name);
    fetchAllSubjects();
    return res;
  }
);
export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ id, categoryName }, thunkAPI) => {
    const res = await updateCategory(id, categoryName);
    fetchAllSubjects();
    return res;
  }
);
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async ({ id }, thunkAPI) => {
    const res = await deleteCategory(id);
    fetchAllSubjects();
    return res;
  }
);
const initialState = {
  listSubjects: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
  isLoadingCreate: false,
  isErrorCreate: false,
  isLoadingUpdate: false,
  isErrorUpdate: false,
  isLoadingDelete: false,
  isErrorDelete: false,
};

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchAllSubjects.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = true;
        state.isErrorFetchAll = false;
      })
      .addCase(fetchAllSubjects.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = false;
        state.listSubjects = action.payload;
      })
      .addCase(fetchAllSubjects.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = true;
      })
      .addCase(createNewSubject.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = true;
        state.isErrorCreate = false;
      })
      .addCase(createNewSubject.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = false;
        state.isErrorCreate = false;
      })
      .addCase(createNewSubject.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = false;
        state.isErrorCreate = true;
      })
      .addCase(updateSubject.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = true;
        state.isErrorUpdate = false;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = false;
        state.isErrorUpdate = false;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = false;
        state.isErrorUpdate = true;
      })
      .addCase(deleteSubject.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = true;
        state.isErrorDelete = false;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = false;
        state.isErrorDelete = false;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = false;
        state.isErrorDelete = true;
      });
  },
});

export default subjectsSlice.reducer;
