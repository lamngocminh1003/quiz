import "../Login/Login.scss";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  userStudentRegister,
  userTeacherRegister,
} from "../../services/userService";
import logo from "../../assets/image/logo.png";
import Button from "@mui/material/Button";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

const Register = (props) => {
  let history = useHistory();
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const inputRefs = useRef([]);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleChangeRole = (event) => {
    const value = event.target.value;
    setSelectedRole(value);
    console.log(value); // Log the selected value to the console
  };
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component được render
    let session = localStorage.getItem("auth");
    if (session) {
      history.push("/");
    }
  }, []);
  const handleViewLogin = () => {
    history.push("/login");
  };
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
      setName(e.target.value);
    }
    if (index === 1) {
      setUserName(e.target.value);
    }
    if (index === 2) {
      setPassword(e.target.value);
    }
    if (index === 3) {
      setConfirmPassword(e.target.value);
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
    isValidName: true,
    isValidUserName: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
    isValidSelectedRole: true,
  };
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
  const isValidInputs = () => {
    setObjCheckInput(defaultValidInput);
    if (!name) {
      toast.error("Vui lòng nhập họ tên");
      setObjCheckInput({ ...defaultValidInput, isValidUserName: false });
      return false;
    }
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
    if (!confirmPassword) {
      toast.error("Vui lòng nhập mật khẩu lần 2");
      setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
      return false;
    }
    if (password !== confirmPassword) {
      setObjCheckInput({
        ...defaultValidInput,
        isValidConfirmPassword: false,
        isValidPassword: false,
      });
      return false;
    }
    if (!selectedRole) {
      toast.error("Vui lòng đăng ký tài khoản Giáo viên hoặc sinh viên");
      setObjCheckInput({ ...defaultValidInput, isValidSelectedRole: false });
      return false;
    }
    return true;
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleRegister();
    }
  };
  const readJwt = (jwt) => JSON.parse(atob(jwt.split(".")[1]));
  const handleRegister = async () => {
    let data = { username, name, password };
    let check = isValidInputs();
    if (check === true) {
      try {
        setIsShowLoading(true);
        let res; // Declare `res` outside the conditional blocks

        if (selectedRole === "Student") {
          res = await userStudentRegister(data);
          console.log("Student register response:", res);
        } else if (selectedRole === "Teacher") {
          res = await userTeacherRegister(data);
          console.log("Teacher register response:", res);
        }

        if (res && res.token) {
          toast.success("Đăng ký thành công");
          let token = res.token;
          let dataFromToken = readJwt(token);
          localStorage.setItem("auth", true);
          localStorage.setItem("token", token);
          localStorage.setItem("username", dataFromToken.nameid);
          localStorage.setItem("uniqueName", dataFromToken.unique_name);
          localStorage.setItem("role", dataFromToken.role);
          localStorage.setItem("year", new Date().getFullYear());
          localStorage.setItem("yearStart", new Date().getFullYear() - 1);
          localStorage.setItem("yearEnd", new Date().getFullYear());
          history.push("/");
        } else {
          console.log("Error response:", res);
          toast.error(`${res.data?.title || "Error during registration"}`);
          setIsShowLoading(false);
        }
        setIsShowLoading(false);
      } catch (error) {
        console.error("Error during registration:", error);
        setIsShowLoading(false);
        toast.error(
          "Đăng ký thất bại. Vui lòng kiểm tra lại mật khẩu hoặc tên tài khoản"
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
              <div className="mb-2 text-center">
                <img src={logo} alt="logo" className="m-2" />
                <div className="detail">Đăng ký</div>
              </div>
              <div className="mb-3">
                <label className="mb-1">Họ tên</label>
                <input
                  type="text"
                  className={
                    objCheckInput.isValidName
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  placeholder="Họ tên"
                  required
                  value={name}
                  ref={(ref) => addInputRef(ref, 0)}
                  onChange={(e) => handleInputChange(e, 0)}
                />
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
                  ref={(ref) => addInputRef(ref, 1)}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
              <div className="mb-3 input-password">
                <label className="mb-1">Mật khẩu</label>
                <input
                  type={isShowPassword === true ? "text" : "password"}
                  placeholder="Mật khẩu"
                  required
                  value={password}
                  ref={(ref) => addInputRef(ref, 2)}
                  onChange={(e) => handleInputChange(e, 2)}
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
              <div className="mb-3 input-password">
                <label className="mb-1">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  required
                  value={confirmPassword}
                  ref={(ref) => addInputRef(ref, 3)}
                  onChange={(e) => handleInputChange(e, 3)}
                  onKeyDown={(event) => handlePressEnter(event)}
                  className={
                    objCheckInput.isValidConfirmPassword
                      ? "form-control"
                      : "form-control "
                  }
                />
              </div>
              <FormControl className="mb-3">
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedRole}
                  onChange={handleChangeRole} // Attach the onChange event handler
                >
                  <FormControlLabel
                    value="Teacher"
                    control={<Radio />}
                    label="Giáo viên"
                  />
                  <FormControlLabel
                    value="Student"
                    control={<Radio />}
                    label="Sinh viên"
                  />
                </RadioGroup>
              </FormControl>
              {isShowLoading && (
                <div className="fa-2x d-flex justify-content-center m-3 text-warning">
                  <i className="fas fa-spinner fa-pulse "></i>
                </div>
              )}
              <div>
                <button
                  className="btn btn-primary btn-warning"
                  onClick={() => {
                    handleRegister();
                  }}
                >
                  Đăng ký
                </button>
                <div className="text-center mt-1 ">
                  <Button
                    variant="text"
                    size="large"
                    color="warning"
                    onClick={() => handleViewLogin()}
                  >
                    <u>Đăng nhập</u>
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

export default Register;
