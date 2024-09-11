import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllQuestionsApi,
  createNewTest,
  updateQuestion,
} from "../../services/questionService";

export const fetchAllQuestions = createAsyncThunk(
  "questions/fetchAllQuestions",
  async ({ orderBy, descending, categoryId }, thunkAPI) => {
    const res = await fetchAllQuestionsApi({ orderBy, descending, categoryId });
    if (res?.items) {
      const transformedData = res?.items.map((item) => {
        const options = item.options.slice(0, 4);
        return {
          questionId: item.questionId,
          testId: item.testId,
          optionA: options[0] ? `${options[0]}` : null, // Nếu option tồn tại, thêm 'A.', nếu không thì null
          optionB: options[1] ? `${options[1]}` : null, // Tương tự cho các option còn lại
          optionC: options[2] ? `${options[2]}` : null,
          optionD: options[3] ? `${options[3]}` : null,
          number: item.number,
          creator: item.creator,
          description: item.description,
          correctAnswer: item.correctAnswer,
        };
      });
      return transformedData;
    }
  }
);
export const createNewSubject = createAsyncThunk(
  "questions/createNewSubject",
  async (name, thunkAPI) => {
    const res = await createNewTest(name);
    return res;
  }
);
export const updateQuestionRedux = createAsyncThunk(
  "questions/updateQuestion",
  async ({ questionId, description, correctAnswer, answers }, thunkAPI) => {
    const res = await updateQuestion({
      questionId,
      description,
      correctAnswer,
      answers,
    });
    return res;
  }
);

const initialState = {
  listQuestions: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
  isLoadingCreate: false,
  isErrorCreate: false,
  isLoadingUpdate: false,
  isErrorUpdate: false,
};

export const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchAllQuestions.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = true;
        state.isErrorFetchAll = false;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = false;
        state.listQuestions = action.payload;
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
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
      .addCase(updateQuestionRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = true;
        state.isErrorUpdate = false;
      })
      .addCase(updateQuestionRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = false;
        state.isErrorUpdate = false;
      })
      .addCase(updateQuestionRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingUpdate = false;
        state.isErrorUpdate = true;
      });
  },
});

export default questionSlice.reducer;
