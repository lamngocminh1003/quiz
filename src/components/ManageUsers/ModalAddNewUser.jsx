import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
} from "@mui/material";
import {
  userStudentRegister,
  userTeacherRegister,
  userAdminRegister,
} from "../../services/userService";
import { fetchAllUsersRedux } from "../../redux/slices/usersSlice";
import { useDispatch } from "react-redux";

const ModalAddNewUser = (props) => {
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const inputRefs = useRef([]);
  const [selectedRole, setSelectedRole] = useState("");

  const handleChangeRole = (event) => {
    const value = event.target.value;
    setSelectedRole(value);
  };

  const [show, setShow] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const handleClose = () => {
    setShow(false);
    setUserName("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setIsShowPassword(false);
    setSelectedRole("");
  };
  const handleShow = () => {
    setShow(true);
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
      toast.error(
        "Vui lòng đăng ký tài khoản giáo viên hoặc sinh viên hoặc quản trị viên"
      );
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
  const handleRegister = async () => {
    let data = { username, name, password };
    let check = isValidInputs();
    if (check === true) {
      try {
        setIsShowLoading(true);
        let res; // Declare `res` outside the conditional blocks

        if (selectedRole === "Student") {
          res = await userStudentRegister(data);
        } else if (selectedRole === "Teacher") {
          res = await userTeacherRegister(data);
        } else if (selectedRole === "Admin") {
          res = await userAdminRegister(data);
        }

        if ((res && res.token) || res.status === 200) {
          toast.success("Tạo tài khảo thành công");
          dispatch(fetchAllUsersRedux());
          handleClose();
        } else {
          console.log("Error response:", res);
          toast.error(`${res.data?.title || "Tạo tài khảo thất bại"}`);
          setIsShowLoading(false);
        }
        setIsShowLoading(false);
      } catch (error) {
        console.error("Tạo tài khảo thất bại", error);
        setIsShowLoading(false);
        toast.error(
          "Đăng ký thất bại. Vui lòng kiểm tra lại mật khẩu hoặc tên tài khoản"
        );
      }
    }
  };
  return (
    <>
      <Button variant="primary" className="mb-3" onClick={handleShow}>
        <span>
          <i className="fa-solid fa-user-plus me-2"></i>
        </span>
        Thêm mới
      </Button>
      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới người dùng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <div className="mb-3 input-password-create">
            <label className="mb-1">Mật khẩu</label>
            <input
              type={isShowPassword === true ? "text" : "password"}
              placeholder="Mật khẩu"
              required
              value={password}
              ref={(ref) => addInputRef(ref, 2)}
              onChange={(e) => handleInputChange(e, 2)}
              className={
                objCheckInput.isValidPassword ? "form-control" : "form-control "
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
          <div className="mb-3">
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
              />{" "}
              <FormControlLabel
                value="Admin"
                control={<Radio />}
                label="Quản trị viên"
              />
            </RadioGroup>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Box>
            <Box display="flex" justifyContent="end" mt="20px" gap="10px">
              <Button variant="secondary" onClick={handleClose}>
                Hủy
              </Button>
              <button
                className="btn btn-primary btn-primary"
                onClick={() => {
                  handleRegister();
                }}
              >
                {isShowLoading && (
                  <i className="fas fa-spinner fa-pulse me-2 "></i>
                )}
                Tạo mới
              </button>
            </Box>
          </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewUser;
