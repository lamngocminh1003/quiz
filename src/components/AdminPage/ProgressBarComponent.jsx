import React from "react";
import "./AdminPage.scss";

const ProgressBarComponent = () => {
  const data = [
    { id: 0, label: "Cơ sở dữ liệu", value: 25, color: "danger" },
    { id: 1, label: "Big data", value: 47, color: "warning" },
    { id: 2, label: "Quản trị mạng", value: 34, color: "info" },
    { id: 3, label: "Hệ điều hành", value: 56, color: "primary" },
    { id: 4, label: "Các môn học khác", value: 100, color: "success" },
  ];
  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Môn học phổ biến nhất dựa trên số lượng bài thi đã làm
          </h6>
        </div>
        <div className="card-body">
          {data.map((progress, index) => (
            <div key={`progress-${index}`}>
              <h4 className="small font-weight-bold">
                {progress.label}
                <span className="float-right">: {progress.value} bài thi</span>
              </h4>
              <div className="progress mb-4">
                <div
                  className={`progress-bar bg-${progress.color} `}
                  style={{ width: `${progress.value}%` }}
                  role="progressbar"
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProgressBarComponent;
