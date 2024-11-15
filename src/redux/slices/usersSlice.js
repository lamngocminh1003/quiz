import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUserByUsername,
  fetchAllUsers,
  fetchAllScoresUser,
  fetchAllScoresByCreatorTest,
} from "../../services/userService";
export const fetchAllScoresByCreatorTestRedux = createAsyncThunk(
  "exams/fetchAllScoresByCreatorTest",
  async (userId, thunkAPI) => {
    const res = await fetchAllScoresByCreatorTest(userId);

    if (res?.data.items) {
      const transformedData = res?.data.items?.map((item, index) => {
        return {
          id: index,
          categoryName: item.test.category.name,
          name: item.test.name,
          description: item.test.description,
          username: item.participant.username,
          fullName: item.participant.name,
          timeTaken: item.timeTaken,
          score: item.score,
        };
      });

      return transformedData;
    }
  }
);
export const getUserByUsernameRedux = createAsyncThunk(
  "users/getUserByUsername",
  async (username, thunkAPI) => {
    const res = await getUserByUsername(username);
    return res.data;
  }
);
export const fetchAllUsersRedux = createAsyncThunk(
  "users/fetchAllUsers",
  async (thunkAPI) => {
    const res = await fetchAllUsers();
    return res;
  }
);
export const fetchAllScoresUserRedux = createAsyncThunk(
  "exams/fetchAllScoresUser",
  async (thunkAPI) => {
    const res = await fetchAllScoresUser();

    if (res?.data.items) {
      const transformedData = res?.data.items?.map((item, index) => {
        return {
          id: index,
          categoryName: item.test.category.name,
          username: item.test.creator.username,
          name: item.test.name,
          description: item.test.description,
          timeTaken: item.timeTaken,
          score: item.score,
        };
      });

      return transformedData;
    }
  }
);
const initialState = {
  dataUser: "",
  listUsers: [],
  listScoresUser: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
  isLoadingFetchAllScores: false,
  isErrorFetchAllScores: false,
  isLoadingGetUser: false,
  isErrorGetUser: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(getUserByUsernameRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingGetUser = true;
        state.isErrorGetUser = true;
      })
      .addCase(getUserByUsernameRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingGetUser = false;
        state.isErrorGetUser = false;
        state.dataUser = action.payload;
      })
      .addCase(getUserByUsernameRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingGetUser = false;
        state.isErrorGetUser = true;
      })
      .addCase(fetchAllScoresUserRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllScores = true;
        state.isErrorFetchAllScores = false;
      })
      .addCase(fetchAllScoresUserRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllScores = false;
        state.isErrorFetchAllScores = false;
        state.listScoresUser = action.payload;
      })
      .addCase(fetchAllScoresUserRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllScores = false;
        state.isErrorFetchAllScores = true;
      })
      .addCase(fetchAllScoresByCreatorTestRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllScores = true;
        state.isErrorFetchAllScores = false;
      })
      .addCase(fetchAllScoresByCreatorTestRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllScores = false;
        state.isErrorFetchAllScores = false;
        state.listScoresUser = action.payload;
      })
      .addCase(fetchAllScoresByCreatorTestRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAllScores = false;
        state.isErrorFetchAllScores = true;
      })
      .addCase(fetchAllUsersRedux.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = true;
        state.isErrorFetchAll = false;
      })
      .addCase(fetchAllUsersRedux.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = false;
        state.listUsers = action.payload.data.users;
      })
      .addCase(fetchAllUsersRedux.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = true;
      });
  },
});

export default usersSlice.reducer;
