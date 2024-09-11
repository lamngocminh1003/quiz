import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserByUsername } from "../../services/userService";

export const getUserByUsernameRedux = createAsyncThunk(
  "users/getUserByUsername",
  async (username, thunkAPI) => {
    const res = await getUserByUsername(username);
    return res.data;
  }
);
const initialState = {
  dataUser: "",
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
      });
  },
});

export default usersSlice.reducer;
