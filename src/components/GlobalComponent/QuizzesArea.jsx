import React from "react";
import QuizCard from "./QuizCard";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
const QuizzesArea = (props) => {
  const dispatch = useDispatch();
  const descending = true;
  useEffect(() => {
    dispatch(fetchAllExams(descending));
  }, []);
  const listExams = useSelector((state) => state?.exams?.listExams?.slice(0, 4));
  const { title, variant } = props;
  let history = useHistory();

  const handleViewAllCategory = () => {
    history.push(`/all-categories`);
  };
  return (
    <div className="mx-3 mt-4">
      <div className="row">
        <h2 className="h4 font-weight-bold col-lg-11 col-md-10 col-9 ">
          {title}
        </h2>
        <Button
          variant={variant}
          color="warning"
          className="col-lg-1 col-md-2 col-3"
          onClick={() => {
            handleViewAllCategory();
          }}
        >
          Tất cả
        </Button>
      </div>
      <div className="mt-4 row">
        <div className="col-12 mb-4">
          <QuizCard data={listExams} />
        </div>
      </div>
    </div>
  );
};

export default QuizzesArea;
