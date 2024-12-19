import React from "react";
import { jsPDF } from "jspdf";
import { FileDownload } from "@mui/icons-material";
import { base64Font } from "./base64Font";
import table from "../../assets/image/table.png";

const TestFile = (data) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const maxWidth = 170; // Chiều rộng tối đa cho nội dung

    // Thêm font tùy chỉnh vào VFS
    doc.addFileToVFS("CustomFont.ttf", base64Font);
    doc.addFont("CustomFont.ttf", "CustomFont", "normal");
    doc.setFont("CustomFont", "normal");

    // Bố cục và trang trí
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 100); // Đặt màu chữ
    doc.text("BÀI KIỂM TRA", 105, 20, { align: "center" }); // Tiêu đề

    let yPosition = 40; // Bắt đầu nội dung ở vị trí thấp hơn
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Màu chữ thông thường

    // Thêm khung thông tin bài kiểm tra
    doc.setDrawColor(100); // Màu viền
    doc.setFillColor(240, 240, 240); // Màu nền
    doc.roundedRect(15, yPosition - 10, 180, 65, 5, 5, "FD");

    // Tên đề kiểm tra
    let lines = doc.splitTextToSize(
      `Tên đề kiểm tra: ${data.dataFolders?.name || "Không có tên"}`,
      maxWidth
    );
    lines.forEach((line) => {
      doc.text(line, 20, yPosition);
      yPosition += 10; // Tăng khoảng cách giữa các dòng
    });

    // Giới thiệu đề kiểm tra
    lines = doc.splitTextToSize(
      `Giới thiệu đề kiểm tra: ${
        data.dataFolders?.description || "Không có mô tả"
      }`,
      maxWidth
    );
    lines.forEach((line) => {
      doc.text(line, 20, yPosition);
      yPosition += 10;
    });

    // Môn học
    lines = doc.splitTextToSize(
      `Môn học: ${data.dataFolders?.categoryName || "Không có mô tả"}`,
      maxWidth
    );
    lines.forEach((line) => {
      doc.text(line, 20, yPosition);
      yPosition += 10;
    });

    doc.text(
      `Tác giả: ${data.dataFolders?.username || "Không có người tạo"}`,
      20,
      yPosition
    );
    yPosition += 10;

    doc.text(
      `Thời gian kiểm tra: ${
        data.dataFolders?.defaultTime || "Không có thời gian khiểm tra"
      } phút`,
      20,
      yPosition
    );

    doc.text(
      `Số câu: ${data.dataFolders?.questions.length || "Không có số câu"}`,
      100,
      yPosition
    );
    yPosition += 10;
    doc.text(`Điểm: ....................`, 20, yPosition);
    doc.text(`Lời phê: ....................`, 100, yPosition); // Căn chỉnh sang phả
    // Thêm hình ảnh (logo hoặc bảng)
    doc.addImage(table, "PNG", 20, yPosition + 10, 180, 50);
    yPosition += 70;

    // Thêm danh sách câu hỏi
    data.dataFolders?.questions?.forEach((question, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont("CustomFont", "normal");
      doc.setTextColor(40, 40, 100); // Làm nổi bật câu hỏi
      // Xử lý văn bản tự động xuống hàng
      const lines = doc.splitTextToSize(
        `${index + 1}. ${question.description || "Câu hỏi không có mô tả"}`,
        maxWidth
      );

      lines.forEach((line) => {
        doc.text(line, 20, yPosition);
        yPosition += 6; // Tăng yPosition sau mỗi dòng
      });

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0); // Màu thông thường cho tùy chọn
      question.options.forEach((option, i) => {
        doc.text(` ${option}`, 30, yPosition);
        yPosition += 6;
      });

      yPosition += 10;
    });
    // *** Footer ***
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Trang ${i} / ${pageCount}`, 105, 290, { align: "center" });
    }
    // Lưu file PDF
    doc.save(`${data.dataFolders?.name || "Bài kiểm tra"}.pdf`);
  };

  return (
    <div>
      <button
        onClick={generatePDF}
        variant="contained"
        title="Tải đề thi"
        className="btn btn-info"
      >
        <FileDownload />
      </button>
    </div>
  );
};

export default TestFile;
