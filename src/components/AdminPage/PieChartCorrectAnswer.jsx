import React, { PureComponent } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PieChartCorrectAnswer = () => {
  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Số lượng đáp án đúng của câu hỏi theo môn học
          </h6>
        </div>
        <div className="card-body"></div>
      </div>{" "}
    </>
  );
};

export default PieChartCorrectAnswer;
