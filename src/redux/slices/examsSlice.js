import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllExamsApi,
  createNewTest,
  deleteTest,
  updateTest,
  createNewTestRandom,
} from "../../services/examService";

export const fetchAllExams = createAsyncThunk(
  "exams/fetchAllExams",
  async ({ orderBy, descending, itemPerPage, page, creator }, thunkAPI) => {
    const res = await fetchAllExamsApi({
      orderBy,
      descending,
      itemPerPage,
      page,
      creator,
    });
    if (res?.tests) {
      const transformedData = res?.tests?.map((item) => {
        return {
          id: item.id,
          categoryId: item.category.id,
          categoryName: item.category.name,
          username: item.creator.username,
          fullName: item.creator.name,
          name: item.name,
          description: item.description,
          defaultTime: item.defaultTime,
          questions: item.questions,
          links: item.links,
          createdAt: item.createdAt,
          modifiedAt: item.modifiedAt,
        };
      });
      return transformedData;
    }
  }
);
export const createNewExam = createAsyncThunk(
  "exams/createNewExam",
  async (
    { categoryId, name, description, defaultTime, questions, links },
    thunkAPI
  ) => {
    const res = await createNewTest(
      categoryId,
      name,
      description,
      defaultTime,
      questions,
      links
    );
    return res;
  }
);
export const editExam = createAsyncThunk(
  "exams/editExam",
  async (
    { id, name, description, defaultTimeMin, links, questions },
    thunkAPI
  ) => {
    const res = await updateTest(
      id,
      name,
      description,
      defaultTimeMin,
      links,
      questions
    );
    return res;
  }
);
export const createNewExamRandom = createAsyncThunk(
  "exams/createNewExamRandom",
  async ({ categoryId, numberOfQuestions, minutes }, thunkAPI) => {
    const res = await createNewTestRandom(
      categoryId,
      numberOfQuestions,
      minutes
    );
    return res;
  }
);
export const deleteExam = createAsyncThunk(
  "exams/deleteExam",
  async (id, thunkAPI) => {
    const res = await deleteTest(id);
    return res;
  }
);
const initialState = {
  listExams: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
  isLoadingCreate: false,
  isErrorCreate: false,
  isLoadingDelete: false,
  isErrorDelete: false,
  isLoadingCreateRadom: false,
  isErrorCreateRandom: false,
  isLoadingUpdate: false,
  isErrorUpdate: false,
};

export const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchAllExams.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = true;
        state.isErrorFetchAll = true;
      })
      .addCase(fetchAllExams.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = false;
        state.listExams = action.payload;
      })
      .addCase(fetchAllExams.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = true;
      })
      .addCase(createNewExam.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = true;
        state.isErrorCreate = false;
      })
      .addCase(createNewExam.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = false;
        state.isErrorCreate = false;
      })
      .addCase(createNewExam.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = false;
        state.isErrorCreate = true;
      })
      .addCase(deleteExam.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = true;
        state.isErrorDelete = false;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = false;
        state.isErrorDelete = false;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = false;
        state.isErrorDelete = true;
      })
      .addCase(createNewExamRandom.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingCreateRadom = true;
        state.isErrorCreateRandom = false;
      })
      .addCase(createNewExamRandom.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingCreateRadom = false;
        state.isErrorCreateRandom = false;
      })
      .addCase(createNewExamRandom.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingCreateRadom = false;
        state.isErrorCreateRandom = true;
      })
      .addCase(editExam.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = true;
        state.isErrorUpdate = false;
      })
      .addCase(editExam.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = false;
        state.isErrorUpdate = false;
      })
      .addCase(editExam.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = false;
        state.isErrorUpdate = true;
      });
  },
});

export default examsSlice.reducer;
