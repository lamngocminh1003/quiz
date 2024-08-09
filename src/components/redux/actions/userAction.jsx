import { legacy_createStore } from "redux";
import { userLogin } from "../../../services/userService";
import { toast } from "react-toastify";

export const USER_LOGOUT = "USER_LOGOUT";
export const FETCH_USER_LOGIN = "FETCH_USER_LOGIN";
export const FETCH_USER_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const FETCH_USER_ERROR = "FETCH_USER_LOGIN_ERROR";
export const USER_REFRESH = "USER_REFRESH";

export const handleLoginRedux = (dataUser) => {
  let dataUsername = dataUser.username;
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USER_LOGIN });
    let res = await userLogin(dataUser);
    if (res) {
      let token = res.data.token;
      dispatch({
        type: FETCH_USER_SUCCESS,
        data: { token, dataUsername },
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("auth", true);
      toast.success("Đăng nhập thành công");
      return res; // Trả về kết quả
    }
    if (res && res.data.userError) {
      dispatch({
        type: FETCH_USER_ERROR,
      });
      toast.error(res.data.userError);
    }
  };
};

export const handleLogoutRedux = () => {
  return (dispatch, getState) => {
    dispatch({
      type: USER_LOGOUT,
    });
  };
};
export const handleRefresh = () => {
  return (dispatch, getState) => {
    dispatch({
      type: USER_REFRESH,
    });
  };
};
