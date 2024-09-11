import React, { useState, useEffect } from "react";
import ContentUp from "./contentUp";
import Pagination from "@mui/material/Pagination";
import "../../../App.scss";
import ContentDown from "./ContentDown";
const InfoExam = () => {
  const itemPerPage = 20; // Số mục trên mỗi trang
  const totalItems = 23;
  const [page, setPage] = useState(1); // Khởi tạo trang hiện tại là trang 1
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const handleChangePage = async (event, value) => {
    setPage(value); // Cập nhật trạng thái của trang hiện tại
  };
  return (
    <>
      <div className="container-xxl py-5">
        <ContentUp />
        <div className="d-flex justify-content-between my-4 align-items-center">
          <div className="d-flex align-items-center">
            <h4 className="section-title bg-white text-start text-secondary ">
              Đánh giá về đề thi
            </h4>
          </div>
          <Pagination
            count={totalPages}
            color="warning"
            page={page} // Thiết lập trang hiện tại
            onChange={handleChangePage} // Sự kiện onChange để bắt trang mới
          />
        </div>
        <ContentDown />
      </div>
    </>
  );
};

export default InfoExam;
