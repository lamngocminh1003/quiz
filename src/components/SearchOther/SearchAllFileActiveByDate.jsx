import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { searchAllFilesActiveByDate } from "../../services/fileService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.scss";
import moment from "moment";
const SearchAllFileActiveByDate = (props) => {
  const { setListFiles, sortOptions, fetchAllFiles } = props;
  const [date, setDate] = useState(null); // Sử dụng `null` làm ngày mặc định
  const handleDate = (date) => {
    setDate(date);
  };
  const handleSearch = async () => {
    if (!date) {
      // toast.error("Tìm kiếm thất bại.Vui lòng nhập từ khóa");
      fetchAllFiles();
    } else if (moment(date).isValid()) {
      const selectedDate = moment(date);
      const nextDate = selectedDate.add(1, "days"); // Thêm 1 ngày
      // Ngày là một giá trị hợp lệ
      const isoDate = moment(nextDate).toISOString(); // Chuyển đổi ngày thành chuỗi ISO
      const originalDate = new Date(isoDate);
      originalDate.setUTCHours(0, 0, 0, 0);
      const isoDate0Hour = originalDate.toISOString();
      try {
        let res = await searchAllFilesActiveByDate(isoDate0Hour, sortOptions);
        if (res && res.data && res.data.files && res.data.files.length <= 0) {
          setListFiles([]);
          toast.error("Không có ngày hiệu lực");
        } else if (res && res.data && res.data.files) {
          setListFiles(res.data.files);
        }
      } catch (error) {
        toast.error("Tìm kiếm thất bại");
      }
    } else {
      toast.error("Ngày không hợp lệ");
    }
  };
  return (
    <div className="col-lg-12">
      <div className="input-group mb-3 col-lg-12">
        <span
          className="input-group-text col-lg-3 col-6"
          id="inputGroup-sizing-default"
        >
          Tìm ngày hiệu lực
        </span>
        <span className="col-lg-4 col-md-3 col-5">
          <DatePicker
            selected={date}
            onChange={(date) => handleDate(date)}
            showMonthDropdown={true}
            showYearDropdown={true}
            scrollableYearDropdown={false}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày hiệu lực"
            className="form-control"
          />
        </span>
        <span className="col-lg-1 col-1">
          <button className="btn btn-primary" onClick={() => handleSearch()}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </span>
      </div>
    </div>
  );
};

export default SearchAllFileActiveByDate;
