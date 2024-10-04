import React from "react";
export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
export const Loading = () => {
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center  mt-4 mx-auto"
        style={{
          height: "250px",
          width: "250px",
          borderBottomLeftRadius: "50%",
          borderTopRightRadius: "50%",
          border: "2px solid #dee2e6",
        }}
      >
        <p className="h5 text-secondary">Đang trả kết quả về...</p>
      </div>
    </>
  );
};
