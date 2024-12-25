import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllExamination } from "../../services/examinationService";

export const fetchAllExaminationRedux = createAsyncThunk(
  "examination/fetchAllExamination",
  async ({ orderBy, descending, CreatorId }, thunkAPI) => {
    const res = await fetchAllExamination({ orderBy, descending, CreatorId });
    if (res?.items) {
      const transformedData = res?.items?.map((item) => {
        return {
          id: item.id,
          examName: item.examName,
          name: item.creator.name,
          startAt: item.startAt,
          endAt: item.endAt,
        };
      });
      return transformedData;
    }
  }
);

const initialState = {
  listExamination: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
};

export const examinationSlice = createSlice({
  name: "examination",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchAllExaminationRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = true;
        state.isErrorFetchAll = false;
      })
      .addCase(fetchAllExaminationRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = false;
        state.listExamination = action.payload;
      })
      .addCase(fetchAllExaminationRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = true;
      });
  },
});

export default examinationSlice.reducer;
