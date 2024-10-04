import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchCategory from "./SearchCategory";
import QuizCard from "../../GlobalComponent/QuizCard";
import { fetchAllExams } from "../../../redux/slices/examsSlice";
import Pagination from "@mui/material/Pagination";
import { fetchAllExamsApi } from "../../../services/examService";

import useDebounce from "../useDebounce";
const AllCategory = () => {
  const [categoryIdSearch, setCategoryIdSearch] = useState({});
  const [categoryNameSearch, setCategoryNameSearch] = useState("");
  const dispatch = useDispatch();
  const itemPerPage = 20; // Số mục trên mỗi trang
  const [page, setPage] = useState(1); // Khởi tạo trang hiện tại là trang 1
  const descending = true;
  const orderBy = "Id";
  useEffect(() => {
    dispatch(fetchAllExams({ orderBy, descending }));
  }, []);
  useEffect(() => {
    handleChangeDataPage(page);
  }, [page]);
  const listExams = useSelector((state) => state.exams.listExams);
  const totalItems = listExams?.length;
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const [listExamsPage, setListExamsPage] = useState([]);
  const handleChangePage = async (event, value) => {
    setPage(value); // Cập nhật trạng thái của trang hiện tại
  };
  const handleChangeDataPage = async (page) => {
    try {
      let res = await fetchAllExamsApi({
        orderBy,
        descending,
        itemPerPage,
        page,
      });
      if (res?.tests && res?.tests.length > 0) {
        setListExamsPage(res.tests);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const searchNameDebounce = useDebounce(categoryNameSearch?.trim());
  const searchCategoryIdDebounce = useDebounce(categoryIdSearch?.id);

  useEffect(() => {
    let mounted = false;
    const cleanup = () => {
      mounted = true;
    };
    const testName = searchNameDebounce;
    const categoryId = searchCategoryIdDebounce;

    if (categoryId && testName.length > 0) {
      fetchAllExamsApi({ orderBy, descending, categoryId, testName }).then(
        (res) => {
          if (mounted) return;
          setListExamsPage(res.tests);
        }
      );
    } else if (categoryId && !testName) {
      fetchAllExamsApi({ orderBy, descending, categoryId }).then((res) => {
        if (mounted) return;
        setListExamsPage(res.tests);
      });
    } else if (!categoryId && testName.length > 0) {
      fetchAllExamsApi({ orderBy, descending, testName }).then((res) => {
        if (mounted) return;
        setListExamsPage(res.tests);
      });
    } else if (!categoryId && !testName) {
      handleChangeDataPage(page);
    }
    return cleanup;
  }, [searchNameDebounce, searchCategoryIdDebounce]);
  return (
    <div>
      <div className="container ">
        <div className="my-5">
          <div>
            <SearchCategory
              setCategoryIdSearch={setCategoryIdSearch}
              categoryIdSearch={categoryIdSearch}
              categoryNameSearch={categoryNameSearch}
              setCategoryNameSearch={setCategoryNameSearch}
            />
          </div>
          <div className="d-flex justify-content-end my-4">
            <Pagination
              count={totalPages}
              color="warning"
              page={page} // Thiết lập trang hiện tại
              onChange={handleChangePage} // Sự kiện onChange để bắt trang mới
            />
          </div>
          <div className="">
            <QuizCard data={listExamsPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
