import React from "react";
import banner from "../../assets/image/banner.png";
const ContentUp = () => {
  return (
    <>
      <div className="row justify-content-between align-items-center flex-column-reverse flex-md-row-reverse">
        <div className="col-md-7 col-12 d-flex align-items-center justify-content-end">
          <img src={banner} alt="banner" className="img-fluid" />
        </div>
        <div className="col-md-5 col-12">
          <div
            style={{
              borderBottom: "8px solid #FFDB5C",
              marginBottom: "20px",
            }}
          >
            <h1 className="my-4 display-4 font-weight-medium text-dark">
              Chào mừng đến với QuizGrad!
            </h1>
          </div>
          <p className="border-left pl-2 py-2 mb-4 text-muted">
            Nơi bạn có thể ôn luyện và đánh giá kiến thức với hàng ngàn câu hỏi
            trắc nghiệm đa dạng.
          </p>
        </div>
      </div>
    </>
  );
};

export default ContentUp;
