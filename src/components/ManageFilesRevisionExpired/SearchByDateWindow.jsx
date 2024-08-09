import React, { useState } from "react";
import { toast } from "react-toastify";
import { searchFileByWindowRevisionId } from "../../services/fileService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
const SearchByDateWindow = (props) => {
  const { setListFiles, revisionId, sortOptions, fetchFileByRevisionActiveId } =
    props;
  const [startTime, setStartTime] = useState(null); // Sử dụng `null` làm ngày mặc định
  const handleStartTime = (startTime) => {
    setStartTime(startTime);
  };
  const [endTime, setEndTime] = useState(null); // Sử dụng `null` làm ngày mặc định
  const handleEndTime = (endTime) => {
    setEndTime(endTime);
  };
  const handleSearch = async () => {
    if (!startTime) {
      fetchFileByRevisionActiveId(revisionId);
    }
    if (!endTime) {
      fetchFileByRevisionActiveId(revisionId);
    } else if (moment(startTime).isValid() && moment(endTime).isValid()) {
      const selectedStartTime = moment(startTime);
      const nextStartTime = selectedStartTime.add(1, "days"); // Thêm 1 ngày
      const selectedEndTime = moment(endTime);
      const nextEndTime = selectedEndTime.add(1, "days");
      // Ngày là một giá trị hợp lệ
      const isoEndTime = moment(nextEndTime).toISOString(); // Chuyển đổi ngày thành chuỗi ISO
      const isoStartTime = moment(nextStartTime).toISOString(); // Chuyển đổi ngày thành chuỗi ISO
      const originalStartTime = new Date(isoStartTime);
      originalStartTime.setUTCHours(0, 0, 0, 0);
      const isoDate0HourStartTime = originalStartTime.toISOString();
      const originalEndTime = new Date(isoEndTime);
      originalEndTime.setUTCHours(0, 0, 0, 0);
      const isoDate0HourEndTime = originalEndTime.toISOString();
      try {
        let res = await searchFileByWindowRevisionId(
          isoDate0HourStartTime,
          isoDate0HourEndTime,
          revisionId,
          sortOptions
        );
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
    <div className="row">
      <div className="border border-info rounded">
        <div className="row p-md-3">
          <div className="col-md-3 col-2 d-flex align-items-center">
            Ngày hiệu lực
          </div>
          <div className="col-md-4 col-3">
            <label className="form-label">Ngày bắt đầu</label>
            <DatePicker
              selected={startTime}
              onChange={(startTime) => handleStartTime(startTime)}
              showMonthDropdown={true}
              showYearDropdown={true}
              scrollableYearDropdown={false}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày bắt đầu"
              className="form-control"
            />
          </div>
          <div className="col-md-4 col-4">
            <label className="form-label">Ngày kết thúc</label>
            <DatePicker
              selected={endTime}
              onChange={(endTime) => handleEndTime(endTime)}
              showMonthDropdown={true}
              showYearDropdown={true}
              scrollableYearDropdown={false}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày kết thúc"
              className="form-control date_field"
            />
          </div>
          <div className="col-md-1 col-2 d-flex align-items-center">
            <button className="btn btn-primary" onClick={() => handleSearch()}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchByDateWindow;
