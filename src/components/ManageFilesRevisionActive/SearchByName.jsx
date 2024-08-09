import React, { useState } from "react";
import { toast } from "react-toastify";
import { searchFileActiveByFolderId } from "../../services/fileService";
const SearchByName = (props) => {
  const { setListFiles, folderId, sortOptions, fetchFileActiveByFolderId } =
    props;
  const [expr, setExpr] = useState("");
  const handleSearch = async () => {
    if (!expr) {
      fetchFileActiveByFolderId(folderId);
    }
    try {
      let res = await searchFileActiveByFolderId(expr, folderId, sortOptions);
      if (res && res.data && res.data.files && res.data.files.length <= 0) {
        setListFiles([]);
        toast.error("Không có mã hoặc tên tài liệu");
      } else if (res && res.data && res.data.files) {
        setListFiles(res.data.files);
      }
    } catch (error) {
      toast.error("Tìm kiếm thất bại");
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
export default SearchByName;
