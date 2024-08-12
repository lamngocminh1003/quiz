import { CSVLink } from "react-csv";
import React, { useState } from "react";
const ExportCSVDepartment = (props) => {
  const { listCascadeByYear } = props;
  const [dataExport, setDataExport] = useState([]);
  const getAllCascadeByYearExport = (event, done) => {
    let result = [];
    if (listCascadeByYear && listCascadeByYear.length > 0) {
      result.push([
        "TT",
        "Khoa/ Phòng",
        "Chỉ số chất lượng",
        "Năm",
        "Công thức",
        "Mục tiêu",
        "Thực hiện",
        "Đánh giá KQ",
        "Qúy 1",
        "Qúy 2",
        "Qúy 3",
        "Qúy 4",
      ]);
      listCascadeByYear.map((item, index) => {
        let arr = [];
        arr[0] = index + 1; // Thứ tự số thứ tự (index)
        arr[1] = item.categoryName;
        arr[2] = item.statName;
        arr[3] = item.effectiveYear;
        arr[4] = item.formulaManifest;
        arr[5] = item.criteriaManifest
          ? `${item.criteriaManifest} ${item?.unit || ""}`
          : "";
        arr[6] = item?.statKQ + " " + item?.unit;
        arr[7] =
          item?.RKQ === -1
            ? "Không đạt"
            : item?.RKQ === 1
            ? "Đạt"
            : item?.RKQ === 0
            ? ""
            : "";
        // Kiểm tra và thêm giá trị mặc định nếu Q1, Q2, Q3, Q4 không tồn tại trong dữ liệu
        arr[8] = item?.statQ1 ? item?.statQ1 : "";
        arr[9] = item?.statQ2 ? item?.statQ2 : "";
        arr[10] = item?.statQ3 ? item?.statQ3 : "";
        arr[11] = item?.statQ4 ? item?.statQ4 : "";
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };
  return (
    <div>
      <CSVLink
        data={dataExport}
        className="btn btn-primary"
        filename={`Danh sách chỉ số khoa/ phòng năm.csv`}
        asyncOnClick={true}
        onClick={(event, done) => getAllCascadeByYearExport(event, done)}
      >
        <span className="me-1">
          <i className="fa-solid fa-download"></i>
        </span>
        Tải kết quả
      </CSVLink>
    </div>
  );
};
export default ExportCSVDepartment;
