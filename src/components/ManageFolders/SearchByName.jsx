import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { searchFolderByCategory } from "../../services/folderService";
const SearchByName = (props) => {
  const { setListFolders, categoryId, sortOption, fetchFoldersByCategoryId } =
    props;
  const [expr, setExpr] = useState("");
  const handleSearch = async () => {
    if (!expr) {
      fetchFoldersByCategoryId(categoryId, sortOption);
    }
    try {
      let res = await searchFolderByCategory(expr, categoryId, sortOption);
      if (res && res.data && res.data.folders && res.data.folders.length <= 0) {
        setListFolders([]);
        toast.error("Không có mã hoặc tên quy trình");
      } else if (res && res.data && res.data.folders) {
        setListFolders(res.data.folders);
      }
    } catch (error) {
      toast.error("Tìm kiếm thất bại");
    }
  };
  return (
    <div className="col-12 col-lg-6">
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Tìm kiếm mã hoặc tên quy trình
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập mã hoặc tên quy trình"
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
