import { CSVLink } from "react-csv";
import React, { useState } from "react";

const ExportCSV = () => {
  const sampleData = [
    {
      question: "Câu hỏi thứ 1",
      answer: "A",
      optionA: "A. Lựa chọn A",
      optionB: "B. Lựa chọn B",
      optionC: "C. Lựa chọn C",
      optionD: "D. Lựa chọn D",
    },
    {
      question: "Câu hỏi thứ 2",
      answer: "B",
      optionA: "A. Lựa chọn A",
      optionB: "B. Lựa chọn B",
      optionC: "C. Lựa chọn C",
      optionD: "D. Lựa chọn D",
    },
    {
      question: "Câu hỏi thứ 3",
      answer: "C",
      optionA: "A. Lựa chọn A",
      optionB: "B. Lựa chọn B",
      optionC: "C. Lựa chọn C",
      optionD: "D. Lựa chọn D",
    },
    {
      question: "Câu hỏi thứ 4",
      answer: "D",
      optionA: "A. Lựa chọn A",
      optionB: "B. Lựa chọn B",
      optionC: "C. Lựa chọn C",
      optionD: "D. Lựa chọn D",
    },
  ];

  const [dataExport, setDataExport] = useState([]);

  const getAllCascadeByYearExport = (event, done) => {
    let result = [];

    // Define the headers based on your structure
    result.push([
      "STT",
      "Câu hỏi",
      "Đáp án",
      "Lựa chọn A",
      "Lựa chọn B",
      "Lựa chọn C",
      "Lựa chọn D",
    ]);

    // Map the sample data to CSV rows
    sampleData.map((item, index) => {
      let arr = [];
      arr[0] = index + 1; // STT
      arr[1] = item.question; // Câu hỏi placeholder
      arr[2] = item.answer; // Đáp án
      arr[3] = item.optionA; // Lựa chọn A
      arr[4] = item.optionB; // Lựa chọn B
      arr[5] = item.optionC; // Lựa chọn C
      arr[6] = item.optionD; // Lựa chọn D

      result.push(arr);
    });

    setDataExport(result);
    done();
  };

  return (
    <span>
      <CSVLink
        data={dataExport}
        className="btn btn-link"
        filename={`Mẫu danh sách câu hỏi.csv`}
        asyncOnClick={true}
        onClick={(event, done) => getAllCascadeByYearExport(event, done)}
      >
        <span className="me-1">
          <i className="fa-solid fa-download"></i>
        </span>
        File upload mẫu
      </CSVLink>
    </span>
  );
};

export default ExportCSV;
