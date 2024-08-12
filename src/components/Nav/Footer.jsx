import React from "react";

const Footer = () => {
  return (
    <>
      <footer
        className=" text-center text-lg-start"
        style={{ backgroundColor: "#FEFFD2" }}
      >
        <div className="container p-4">
          <div className="row">
            <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
              <h5 className="text-uppercase">Về QuizGard</h5>

              <p>
                QuizGard là nền tảng cung cấp ngân hàng câu hỏi trắc nghiệm đa
                dạng, phục vụ cho nhiều môn học hiện theo chương trình giáo dục
                hiện nay. Chúng tôi cam kết mang đến trải nghiệm học tập và kiểm
                tra hiệu quả với các tính năng như tạo đề thi tự động và phân
                tích kết quả chi tiết. Tham gia cộng đồng của chúng tôi để trải
                nghiệm sự khác biệt mà QuizGard mang lại!
              </p>
            </div>

            <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
              <h5 className="text-uppercase">Chính sách bảo mật</h5>

              <p>
                QuizGard cam kết bảo vệ thông tin cá nhân của bạn bằng các biện
                pháp bảo mật nghiêm ngặt. Thông tin của bạn sẽ được mã hóa và
                lưu trữ an toàn, không chia sẻ với bên thứ ba mà không có sự
                đồng ý của bạn. Nếu có bất kỳ câu hỏi nào về chính sách bảo mật,
                vui lòng liên hệ với chúng tôi.
              </p>
            </div>
          </div>
        </div>

        <div
          className="text-center p-3"
          style={{ background: "rgba(0, 0, 0, 0.05)" }}
        >
          © 2024 Copyright:
          <div className="text-body">QuizGrad</div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
