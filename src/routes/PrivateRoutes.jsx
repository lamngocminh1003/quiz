import React, { useContext, useEffect } from "react";
import { Route, useHistory, Redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import jwt_decode from "jwt-decode";

const PrivateRoutes = (props) => {
  const { logout } = useContext(UserContext);
  const auth = localStorage.getItem("auth");
  const history = useHistory();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      // Token không tồn tại, đưa người dùng về trang login
      redirectToLogin();
    } else {
      // Token tồn tại, giải mã nó để kiểm tra thời hạn
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
      if (decodedToken.exp < currentTime) {
        // Token đã hết hạn, thực hiện xử lý tương tự
        logoutAndRedirect();
      }
    }
  }, [token, history]);
  const redirectToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("uniqueName");
    localStorage.removeItem("role");
    localStorage.removeItem("year");
    localStorage.removeItem("yearStart");
    localStorage.removeItem("yearEnd");
    history.push("/login");
  };
  const logoutAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("uniqueName");
    localStorage.removeItem("role");
    localStorage.removeItem("year");
    localStorage.removeItem("yearStart");
    localStorage.removeItem("yearEnd");
    // Thực hiện các thao tác đăng xuất khác nếu cần
    logout();
    history.push("/login");
  };
  if (auth) {
    return (
      <>
        <Route path={props.path} component={props.component}></Route>
      </>
    );
  } else {
    return (
      <>
        <Redirect to="/login"></Redirect>;
      </>
    );
  }
};
export default PrivateRoutes;
