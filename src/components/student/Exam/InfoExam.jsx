import React, { useState, useEffect } from "react";
import ContentUp from "./ContentUp";
import Pagination from "@mui/material/Pagination";
import "../../../App.scss";
import { useParams } from "react-router-dom";
import ContentDown from "./ContentDown";
import { fetchAllComment } from "../../../redux/slices/commentsSlice";
import { useDispatch, useSelector } from "react-redux";

const InfoExam = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const descending = true;
  const orderBy = "Id";
  const listComments = useSelector((state) => state.comments.listComments);

  const totalItems = listComments?.length;
  const itemPerPage = 10; // Số mục trên mỗi trang
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const [page, setPage] = useState(1); // Khởi tạo trang hiện tại là trang 1
  const handleChangePage = async (event, value) => {
    setPage(value); // Cập nhật trạng thái của trang hiện tại
  };
  const dateFormat = (time) => {
    const localDate = new Date(time).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return localDate;
  };
  useEffect(() => {
    dispatch(fetchAllComment({ testId: id, orderBy, descending }));
  }, [id, dispatch]);
  return (
    <>
      <div className="container-xxl py-5">
        <ContentUp id={id} dateFormat={dateFormat} />
        <div className="d-flex justify-content-between my-4 align-items-center">
          <div className="d-flex align-items-center">
            <h4 className="section-title bg-white text-start text-secondary ">
              Đánh giá về đề thi
            </h4>
          </div>
          <div className="row">
            <Pagination
              count={totalPages}
              color="warning"
              page={page} // Thiết lập trang hiện tại
              onChange={handleChangePage} // Sự kiện onChange để bắt trang mới
            />
          </div>
        </div>
        <ContentDown
          id={id}
          page={page}
          orderBy={orderBy}
          descending={descending}
          itemPerPage={itemPerPage}
          dateFormat={dateFormat}
        />
      </div>
    </>
  );
};

export default InfoExam;
