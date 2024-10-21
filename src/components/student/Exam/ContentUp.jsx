import React, { useState, useEffect } from "react";
import examImg from "../../../assets/image/exam.png";
import "../../../App.scss";
import { useHistory } from "react-router-dom";
import { fetchAllExams } from "../../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
const ContentUp = (props) => {
  const dispatch = useDispatch();
  const [timeEdit, setTimeEdit] = useState("");
  const dataExam = useSelector((state) => state?.exams?.listExams[0]);
  const { id, dateFormat } = props;
  useEffect(() => {
    dispatch(fetchAllExams({ testId: id }));
  }, [id, dispatch]);

  useEffect(() => {
    if (dataExam?.modifiedAt) {
      const localDate = dateFormat(dataExam?.modifiedAt);
      setTimeEdit(localDate);
    }
  }, [dataExam]);
  let history = useHistory();
  const handleDoingExam = () => {
    history.push(`/doing-exam/${dataExam?.id}/${dataExam?.defaultTime}`);
  };

  return (
    <>
      <div className="container">
        <div className="row g-5">
          <div
            className="col-lg-6 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ minHeight: "400px" }}
          >
            <div className="position-relative h-100">
              <img
                className="img-fluid position-absolute w-100 h-100"
                src={examImg}
                alt="Ảnh minh hoạt đề thi"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
            <h6 className="section-title bg-white text-start text-warning pe-3"></h6>
            <h3 className="mb-4">
              Tên đề thi: <span className="text-primary">{dataExam?.name}</span>
            </h3>
            <p className="mb-4">Giới thiệu đề thi: {dataExam?.description} </p>
            <p className="mb-4">Giáo viên ra đề: {dataExam?.fullName}</p>
            <div className="row gy-2 gx-4 mb-4">
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Môn học: {dataExam?.categoryName}
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Số lượng câu hỏi: {dataExam?.questions?.length}
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Thời gian làm bài: {dataExam?.defaultTime} phút
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Thời gian cập nhật gần đây: {timeEdit}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-outline-warning py-3 px-4 mt-2"
                onClick={() => handleDoingExam()}
              >
                <i className="fa-regular fa-circle-play me-2"></i> Thi ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentUp;
