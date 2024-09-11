import React from "react";
import examImg from "../../../assets/image/exam.png";
import "../../../App.scss";
import { useHistory } from "react-router-dom";

const ContentUp = () => {
  let history = useHistory();
  const handleDoingExam = () => {
    console.log("hello");

    history.push("/doing-exam");
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
            <h6 className="section-title bg-white text-start text-warning pe-3">
              Thông tin đề thi
            </h6>
            <h3 className="mb-4">
              Tên đề thi: <span className="text-primary">Tourist</span>
            </h3>
            <p className="mb-4">Giới thiệu đề thi: </p>
            <p className="mb-4">Giáo viên ra đề:</p>
            <div className="row gy-2 gx-4 mb-4">
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Môn học:
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Số lượng câu hỏi:
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Thời gian làm bài:
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2"></i>
                  Thời gian cập nhật gần đây:
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
