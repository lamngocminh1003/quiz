import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserByUsername, fetchAllUsers } from "../../services/userService";

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
const initialState = {
  dataUser: "",
  listUsers: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
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
