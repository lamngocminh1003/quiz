import React from "react";
import { useHistory } from "react-router-dom";
import "../ErrorPage/Page500.scss";
const Page404 = () => {
  let history = useHistory();
  const handleBack = () => {
    history.push("/");
  };
  return (
    <div>
      <div className="section">
        <h1 className="error">404</h1>
        <div className="page">Trang không tồn tại.</div>
        <div>
          <a className="back-home" onClick={() => handleBack()}>
            <span>
              <i className="fa-solid fa-rotate-left me-1"></i>
            </span>
            Trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};
export default Page404;
