import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewComment,
  fetchAllCommentApi,
  deleteComment,
} from "../../services/commentService";

export const createNewUserComment = createAsyncThunk(
  "comments/createNewUserComment",
  async ({ testId, comment }, thunkAPI) => {
    const res = await createNewComment({ testId, comment });
    return res;
  }
);
export const fetchAllComment = createAsyncThunk(
  "comments/fetchAllComment",
  async (
    { orderBy, descending, testId, itemPerPage, page, username },
    thunkAPI
  ) => {
    const res = await fetchAllCommentApi({
      orderBy,
      descending,
      testId,
      itemPerPage,
      page,
      username,
    });
    if (res?.items) {
      const transformedData = res?.items?.map((item) => {
        return {
          id: item.id,
          username: item.creator.username,
          fullName: item.creator.name,
          content: item.content,
        };
      });

      return transformedData;
    }
  }
);
export const deleteUserComment = createAsyncThunk(
  "comments/deleteUserComment",
  async ({ commentId }, thunkAPI) => {
    const res = await deleteComment(commentId);
    return res;
  }
);
const initialState = {
  listComments: [],
  isLoadingFetchAll: false,
  isErrorFetchAll: false,
  isLoadingCreate: false,
  isErrorCreate: false,
  isLoadingDelete: false,
  isErrorDelete: false,
};

export const usersSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(createNewUserComment.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = true;
        state.isErrorCreate = false;
      })
      .addCase(createNewUserComment.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = false;
        state.isErrorCreate = false;
      })
      .addCase(createNewUserComment.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingCreate = false;
        state.isErrorCreate = true;
      })
      .addCase(fetchAllComment.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = true;
        state.isErrorFetchAll = false;
      })
      .addCase(fetchAllComment.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = false;
        state.listComments = action.payload;
      })
      .addCase(fetchAllComment.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingFetchAll = false;
        state.isErrorFetchAll = true;
      })
      .addCase(deleteUserComment.pending, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = true;
        state.isErrorDelete = false;
      })
      .addCase(deleteUserComment.fulfilled, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = false;
        state.isErrorDelete = false;
      })
      .addCase(deleteUserComment.rejected, (state, action) => {
        // Add user to the state array
        state.isLoadingDelete = false;
        state.isErrorDelete = true;
      });
  },
});

export default usersSlice.reducer;
