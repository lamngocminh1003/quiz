import { CSVLink } from "react-csv";
import React, { useState } from "react";
const ExportCSV = (props) => {
  const { listCascadeByYear } = props;
  const [dataExport, setDataExport] = useState([]);
  const getAllCascadeByYearExport = (event, done) => {
    let result = [];
    if (listCascadeByYear && listCascadeByYear.length > 0) {
      result.push([
        "TT",
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
        arr[1] = item.statName;
        arr[2] = item.effectiveYear;
        arr[3] = item.formula;
        arr[4] = item.criteria + " " + item?.unit;
        arr[5] = item.average?.KQ?.stat + " " + item?.unit;
        arr[6] =
          item.average?.KQ?.rating === -1
            ? "Không đạt"
            : item.average?.KQ?.rating === 1
            ? "Đạt"
            : item.average?.KQ?.rating === 0
            ? ""
            : "";
        // Kiểm tra và thêm giá trị mặc định nếu Q1, Q2, Q3, Q4 không tồn tại trong dữ liệu
        arr[7] = item.average?.Q1 ? item.average?.Q1.stat : "";
        arr[8] = item.average?.Q2 ? item.average?.Q2.stat : "";
        arr[9] = item.average?.Q3 ? item.average?.Q3.stat : "";
        arr[10] = item.average?.Q4 ? item.average?.Q4.stat : "";
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
        filename={`Danh sách chỉ số bệnh viện.csv`}
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
export default ExportCSV;
