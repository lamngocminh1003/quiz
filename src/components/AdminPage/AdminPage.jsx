import React, { useState, useEffect } from "react";
import "./AdminPage.scss";
import CardComponent from "./CardComponent";
import AreaChartComponent from "./AreaChartComponent";
import PieChartComponent from "./PieChartComponent";
import ProgressBarComponent from "./ProgressBarComponent";
import LargeCardComponent from "./LargeCardComponent";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
function AdminPage() {
  const dispatch = useDispatch();
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const listSubjectsLength = listSubjects?.categories?.length;
  const listExams = useSelector((state) => state.exams.listExams);
  const listExamsLength = listExams?.length;
  useEffect(() => {
    dispatch(fetchAllSubjects({}));
    dispatch(fetchAllExams({}));
  }, []);
  return (
    <div className="container my-3">
      <body id="page-top">
        <div id="wrapper">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                  <h1 className="h3 mb-0 text-gray-800">Trang quản lý</h1>
                  <button
                    href="#"
                    className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  >
                    <i className="fas fa-download fa-sm text-white-50"></i>
                    Generate Report
                  </button>
                </div>

                <div className="row">
                  <CardComponent
                    title="Đề thi"
                    content={`Số lượng: ${listExamsLength}`}
                    icon="fa-solid fa-file-circle-question"
                    link="/admin/exams"
                    color="primary"
                    sizeXl="3"
                    sizeMd="6"
                  />
                  <CardComponent
                    title="Người dùng"
                    content="Số lượng người dùng"
                    icon="fa-solid fa-users"
                    link="/user"
                    color="success"
                    sizeXl="3"
                    sizeMd="6"
                  />
                  <CardComponent
                    title="Môn học"
                    icon="fa-solid fa-swatchbook"
                    link="/subject"
                    color="info"
                    sizeXl="3"
                    sizeMd="6"
                    content={`Số lượng: ${listSubjectsLength}`}
                  />
                  <CardComponent
                    title="Phản hồi"
                    content="Số lượng phản hồi"
                    icon="fa-solid fa-comments"
                    link="/comment"
                    color="warning"
                    sizeXl="3"
                    sizeMd="6"
                  />
                </div>
                <div className="row">
                  <div className="col-xl-8 col-lg-7">
                    <AreaChartComponent />
                  </div>
                  <div className="col-xl-4 col-lg-5">
                    <PieChartComponent />
                  </div>
                </div>
                <div className="row">
                  {/*   <!-- Content Column --> */}
                  <div className="col-lg-6 mb-4">
                    <ProgressBarComponent />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <LargeCardComponent />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </body>
    </div>
  );
}

export default AdminPage;
