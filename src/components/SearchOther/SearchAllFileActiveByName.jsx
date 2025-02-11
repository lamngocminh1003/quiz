import React, { useState } from "react";
import { toast } from "react-toastify";
import { searchAllFileActiveName } from "../../services/fileService";
const SearchAllFileByName = (props) => {
  const { setListFiles, sortOptions, fetchAllFiles } = props;
  const [expr, setExpr] = useState("");
  const handleSearch = async () => {
    if (!expr) {
      // toast.error("Tìm kiếm thất bại. Vui lòng nhập từ khóa");
      fetchAllFiles();
    }
    try {
      let res = await searchAllFileActiveName(expr, sortOptions);
      if (res && res.data && res.data.files && res.data.files.length <= 0) {
        setListFiles([]);
        toast.error("Không có mã hoặc tên tài liệu");
      } else if (res && res.data && res.data.files) {
        setListFiles(res.data.files);
      }
    } catch (error) {
      // toast.error("Tìm kiếm thất bại");
    }
  };

  return (
    <div className="col-12">
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Tìm kiếm mã hoặc tên tài liệu
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập mã hoặc tên tài liệu"
          onChange={(event) => {
            setExpr(event.target.value);
          }}
        />
        <button className="btn btn-primary" onClick={() => handleSearch()}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
  );
};
export default SearchAllFileByName;
