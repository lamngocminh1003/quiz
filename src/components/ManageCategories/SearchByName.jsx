import React, { useState } from "react";
import { toast } from "react-toastify";
import { searchCategory } from "../../services/categoryService";
const SearchByName = (props) => {
  const { fetchCategories, setListCategories } = props;
  const [expr, setExpr] = useState("");
  const [sortOptions, setSortOptions] = useState(5);
  const handleSearch = async () => {
    if (!expr) {
      fetchCategories();
    }
    try {
      let res = await searchCategory(expr, sortOptions);
      if (
        res &&
        res.data &&
        res.data.categories &&
        res.data.categories.length <= 0
      ) {
        setListCategories([]);
        toast.error("Không có tên thư mục");
      } else if (res && res.data && res.data.categories) {
        setListCategories(res.data.categories);
      }
    } catch (error) {
      // toast.error("Tìm kiếm thất bại");
    }
  };
  return (
    <div className="col-12">
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Tìm kiếm tên thư mục
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập tên thư mục"
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
