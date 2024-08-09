import "../Login/Login.scss";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { userLogin } from "../../services/userService";
import { UserContext } from "../../context/UserContext";
import logo from "../../assets/image/logo.png";
import Button from "@mui/material/Button";

const Login = (props) => {
  let history = useHistory();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const inputRefs = useRef([]);
  const [isShowLoading, setIsShowLoading] = useState(false);
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component được render
    let session = localStorage.getItem("auth");
    if (session) {
      history.push("/");
    }
  }, []);
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus();
      } else {
        inputRefs.current[0].focus(); // Focus on the first input field
      }
    }
  };
  const handleInputChange = (e, index) => {
    if (index === 0) {
      setUserName(e.target.value);
    }
    if (index === 1) {
      setPassword(e.target.value);
    }
  };
  const addInputRef = (ref, index) => {
    if (ref && !inputRefs.current.includes(ref)) {
      inputRefs.current.push(ref);
      if (index === inputRefs.current.length - 1) {
        ref.onkeydown = (e) => handleKeyDown(e, index);
      }
    }
  };
  const defaultValidInput = {
    isValidUserName: true,
    isValidPassword: true,
  };
  const handleViewRegister = () => {
    history.push("/register");
  };
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
  const isValidInputs = () => {
    setObjCheckInput(defaultValidInput);
    if (!username) {
      toast.error("Vui lòng nhập tài khoản");
      setObjCheckInput({ ...defaultValidInput, isValidUserName: false });
      return false;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }

    return true;
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleLogin();
    }
  };
  const handleLogin = async () => {
    let data = { username, password };
    let check = isValidInputs();
    if (check === true) {
      try {
        setIsShowLoading(true);
        let res = await userLogin(data);
        if (res) {
          toast.success("Đăng nhập thành công");
          let token = res.data.token;
          localStorage.setItem("auth", true);
          localStorage.setItem("token", token);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("categoryId", res.data.categoryId);
          localStorage.setItem("year", new Date().getFullYear());
          localStorage.setItem("yearStart", new Date().getFullYear() - 1);
          localStorage.setItem("yearEnd", new Date().getFullYear());
          history.push("/");
        }
        setIsShowLoading(false);
      } catch (error) {
        setIsShowLoading(false);
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại mật khẩu hoặc tài khoản"
        );
      }
    }
  };
  return (
    <div className="login-container ">
      <div className="container ">
        <div className="row">
          <div className="content-left col-sm-12 col-lg-6 ">
            <div className="brand mt-4">
              NGÂN HÀNG CÂU HỎI VÀ THI TRẮC NGHIỆM TRỰC TUYẾN
            </div>
          </div>
          <div className="content-right mt-lg-5 mt-sm-3 col-12 col-lg-6">
            <div className="login-form">
              <div className="mb-3 text-center">
                <img src={logo} alt="logo" className="mb-2" />
                <div className="detail">Đăng nhập</div>
              </div>
              <div className="mb-3">
                <label className="mb-1">Tên tài khoản</label>

                <input
                  type="text"
                  className={
                    objCheckInput.isValidUserName
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  placeholder="Tên tài khoản"
                  required
                  value={username}
                  ref={(ref) => addInputRef(ref, 0)}
                  onChange={(e) => handleInputChange(e, 0)}
                />
              </div>
              <div className="mb-3 input-password">
                <label className="mb-1">Mật khẩu</label>
                <input
                  type={isShowPassword === true ? "text" : "password"}
                  placeholder="Mật khẩu"
                  required
                  value={password}
                  ref={(ref) => addInputRef(ref, 1)}
                  onChange={(e) => handleInputChange(e, 1)}
                  onKeyDown={(event) => handlePressEnter(event)}
                  className={
                    objCheckInput.isValidPassword
                      ? "form-control"
                      : "form-control "
                  }
                />
                <i
                  className={
                    isShowPassword === true
                      ? "fa-regular fa-eye "
                      : "fa-regular fa-eye-slash"
                  }
                  onClick={() => setIsShowPassword(!isShowPassword)}
                ></i>
              </div>
              {isShowLoading && (
                <div className="fa-2x d-flex justify-content-center m-3 text-warning">
                  <i className="fas fa-spinner fa-pulse "></i>
                </div>
              )}
              <div>
                <button
                  className="btn btn-primary btn-warning"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Đăng nhập
                </button>
                <div className="text-center mt-1 ">
                  <Button
                    variant="text"
                    size="large"
                    color="warning"
                    onClick={() => handleViewRegister()}
                  >
                    <u>Đăng ký</u>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
