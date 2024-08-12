import React from "react";
import QuizCard from "./QuizCard";
import Button from "@mui/material/Button";
const QuizzesArea = (props) => {
  const { title, variant } = props;
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
        >
          Tất cả
        </Button>
      </div>
      <div className="mt-4 row">
        <div className="col-12 mb-4">
          <QuizCard />
        </div>
      </div>
    </div>
  );
};

export default QuizzesArea;
