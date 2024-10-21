import "./AdminPage.scss";
import React from "react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import AreaChartComponentGlobal from "../GlobalComponent/AreaChartComponentGlobal";
const AreaChartComponent = () => {
  const dispatch = useDispatch();
  const listExams = useSelector((state) => state.exams.listExams);

  useEffect(() => {
    dispatch(fetchAllExams({ orderBy: "createdAt", descending: true }));
  }, [dispatch]);

  return (
    <>
      <div className="card shadow mb-4">
        {/* Card Header */}
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            Số lượng bài thi mới được thêm
          </h6>
        </div>
        {/* Card Body */}
        <div className="card-body">
          <AreaChartComponentGlobal lengthDate="10" listExams={listExams} />
        </div>
      </div>
    </>
  );
};

export default AreaChartComponent;
