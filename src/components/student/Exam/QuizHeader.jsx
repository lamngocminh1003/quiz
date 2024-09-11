/* eslint-disable react/prop-types */

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const QuizHeader = ({ timer, handleSubmit }) => {
  return (
    <section
      className="shadow-sm mt-4 pt-3 sticky-top bg-white z-index-100"
      id="alertContainer"
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="font-weight-normal">
          <span className="text-danger">Chú ý!</span> Bạn có 15 phút để trả lời
          6 câu hỏi. Hãy chú ý đến đồng hồ và đảm bảo trả lời tất cả các câu hỏi
          trước khi hết thời gian.
        </div>
        <div className="d-flex align-items-center">
          <div className="text-left ">
            <p
              className="text-success fw-normal  font-monospace h4 text-center"
              id="count "
            >
              {formatTime(timer)}
            </p>
            <p className="small text-secondary">Thời gian thi</p>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            onClick={handleSubmit}
            className="btn btn-warning text-white px-4 py-2 rounded"
          >
            Nộp bài thi
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuizHeader;
