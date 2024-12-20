import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllExamsApi,
  createNewTest,
  deleteTest,
  updateTest,
  createNewTestRandom,
  doingTest,
  testGrade,
  fetchAllExamsInvited,
} from "../../services/examService";

export const fetchAllExams = createAsyncThunk(
  "exams/fetchAllExams",
  async (
    { orderBy, descending, itemPerPage, page, creator, testName, testId },
    thunkAPI
  ) => {
    const res = await fetchAllExamsApi({
      orderBy,
      descending,
      itemPerPage,
      page,
      testName,
      testId,
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
          isPrivate: item.isPrivate,
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
export const fetchAllExamsInvitedRedux = createAsyncThunk(
  "exams/fetchAllExamsInvited",
  async (thunkAPI) => {
    const res = await fetchAllExamsInvited();
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
          isPrivate: item.isPrivate,
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
    { categoryId, name, description, defaultTime, questions, isPrivate, links },
    thunkAPI
  ) => {
    const res = await createNewTest(
      categoryId,
      name,
      description,
      defaultTime,
      questions,
      isPrivate,
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
export const submitExam = createAsyncThunk(
  "exams/submitExam",
  async ({ token, answers }, thunkAPI) => {
    const res = await testGrade(token, answers);
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
export const doingExam = createAsyncThunk(
  "exams/doingExam",
  async ({ testId, minutes }, thunkAPI) => {
    const res = await doingTest(testId, minutes);
    return res;
  }
);
const initialState = {
  listExams: [],
  examData: [],
  result: {},
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
  isLoadingDoing: false,
  isErrorDoing: false,
  isLoadingSubmit: false,
  isErrorSubmit: false,
  listExamsInvited: [],
  isLoadingFetchAllInvited: false,
  isErrorFetchAllInvited: false,
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
      .addCase(fetchAllExamsInvitedRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllInvited = true;
        state.isErrorFetchAllInvited = true;
      })
      .addCase(fetchAllExamsInvitedRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllInvited = false;
        state.isErrorFetchAllInvited = false;
        state.listExamsInvited = action.payload;
      })
      .addCase(fetchAllExamsInvitedRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllInvited = false;
        state.isErrorFetchAllInvited = true;
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
      .addCase(submitExam.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingSubmit = true;
        state.isErrorSubmit = false;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingSubmit = false;
        state.isErrorSubmit = false;
        state.result = action.payload.data;
      })
      .addCase(submitExam.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingSubmit = false;
        state.isErrorSubmit = true;
      })
      .addCase(doingExam.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingDoing = true;
        state.isErrorDoing = false;
      })
      .addCase(doingExam.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingDoing = false;
        state.isErrorDoing = false;
        state.examData = action.payload.data;
      })
      .addCase(doingExam.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingDoing = false;
        state.isErrorDoing = true;
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
