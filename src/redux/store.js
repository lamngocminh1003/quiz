import { configureStore } from "@reduxjs/toolkit";
import subjectsSlice from "./slices/subjectsSlice";
import usersSlice from "./slices/usersSlice";
import examsSlice from "./slices/examsSlice";
import questionSlice from "./slices/questionSlice";
import commentsSlice from "./slices/commentsSlice";
import examinationSlice from "./slices/examinationSlice";

export const store = configureStore({
  reducer: {
    subjects: subjectsSlice,
    users: usersSlice,
    exams: examsSlice,
    questions: questionSlice,
    comments: commentsSlice,
    examination: examinationSlice,
  },
});
