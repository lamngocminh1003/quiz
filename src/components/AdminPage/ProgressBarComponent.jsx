import "./AdminPage.scss";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

const ProgressBarComponent = () => {
  const dispatch = useDispatch();
  const descending = true;
  const orderBy = "Id";
  const listExams = useSelector((state) => state.exams.listExams);

  useEffect(() => {
    dispatch(fetchAllExams({ orderBy, descending }));
  }, [dispatch]);

  const generateTopCategories = (data, topCount = 4) => {
    // Danh sách màu sắc cố định (không lặp lại)
    const fixedColors = [
      "danger",
      "warning",
      "info",
      "primary",
      "secondary",
      "success",
    ];

    // Nhóm số lượng bài thi theo categoryName
    const categoryCounts = data.reduce((acc, item) => {
      acc[item.categoryName] = (acc[item.categoryName] || 0) + 1;
      return acc;
    }, {});

    // Chuyển thành mảng, sắp xếp giảm dần theo số lượng bài thi
    const categories = Object.entries(categoryCounts)
      .map(([label, value], index) => ({
        id: index,
        label,
        value,
        color: fixedColors[index] || null, // Gắn màu nếu còn màu trong danh sách, nếu không thì null
      }))
      .sort((a, b) => b.value - a.value);

    // Lấy `topCount` danh mục và tính tổng các danh mục còn lại
    const topCategories = categories.slice(0, topCount);
    const remaining = categories.slice(topCount);
    const totalRemaining = remaining.reduce((sum, item) => sum + item.value, 0);

    // Thêm mục tổng các bài thi còn lại
    if (totalRemaining > 0) {
      topCategories.push({
        id: topCount,
        label: "Các môn học khác",
        value: totalRemaining,
        color: fixedColors[topCount] || "gray", // Gắn màu cố định nếu còn, nếu không thì màu mặc định
      });
    }

    return topCategories;
  };
  const result = generateTopCategories(listExams);

  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Môn học phổ biến nhất dựa trên số lượng bài thi đã tạo
          </h6>
        </div>
        <div className="card-body">
          {result.map((progress, index) => (
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
