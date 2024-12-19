import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateUser, updateUserPassword } from "../../services/userService";
import { getUserByUsernameRedux } from "../../redux/slices/usersSlice";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import "./ModalEditUser.scss";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ModalEditUser = (props) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const defaultValidInput = {
    isValidOldPassword: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  };
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
  const isValidInputs = () => {
    setObjCheckInput(defaultValidInput);

    if (!oldPassword) {
      toast.error("Vui lòng nhập mật khẩu cũ");
      setObjCheckInput({ ...defaultValidInput, isValidOldPassword: false });
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
      toast.error("Mật khẩu không khớp");
      setObjCheckInput({
        ...defaultValidInput,
        isValidConfirmPassword: false,
        isValidPassword: false,
      });
      return false;
    }

    // Password validation for complexity
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Mật khẩu phải có ít nhất một chữ cái in hoa");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }

    if (!/[0-9]/.test(password)) {
      toast.error("Mật khẩu phải có ít nhất một chữ số");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Mật khẩu phải có ít nhất một chữ cái thường");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      toast.error("Mật khẩu phải có ít nhất một ký tự đặc biệt");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }

    return true;
  };
  let { setShowEdit, showEdit, dataUsers } = props;
  const handleClose = () => {
    setShowEdit(false);
    setName(dataUsers.uniqueName);
    setUsername(dataUsers.username);
    setConfirmPassword("");
    setOldPassword("");
    setPassword("");
  };
  const handleOnClickEdit = async () => {
    if (!name) {
      toast.error("Trường họ tên không được để trống!");
      return;
    }
    try {
      let res = await updateUser(name);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin cá nhân thành công");
        dispatch(getUserByUsernameRedux(username));
        localStorage.setItem("uniqueName", name);
      }
    } catch (error) {
      toast.error("Cập nhật thông tin cá nhân không thành công");
    }
  };

  useEffect(() => {
    if (showEdit) {
      setName(dataUsers.uniqueName);
      setUsername(dataUsers.username);
    }
  }, [dataUsers]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOnClickEditPassword = async () => {
    let check = isValidInputs();
    if (check === true) {
      try {
        let res = await updateUserPassword(oldPassword, password);
        if (res) {
          //success
          setShowEdit(false);
          toast.success("Thay đổi mất khẩu thành công");
          dispatch(getUserByUsernameRedux(username));
          setConfirmPassword("");
          setOldPassword("");
          setPassword("");
        }
      } catch (error) {
        toast.error("Thay đổi mất khẩu không thành công");
      }
    }
  };
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Chỉnh sửa thông tin cá nhân
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Họ tên" {...a11yProps(0)} />
                <Tab label="Mật khẩu" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Tài khoản
                </span>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={username}
                  disabled
                />
              </div>
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Mật khẩu
                </span>
                <input
                  className="form-control"
                  type="password"
                  defaultValue="password"
                  disabled
                />
              </div>{" "}
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Họ tên
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>{" "}
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={() => handleOnClickEdit()}>
                  Lưu thay đổi
                </Button>
              </Modal.Footer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="input-group mb-3 input-password">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Mật khẩu hiện tại
                </span>
                <input
                  type={isShowOldPassword === true ? "text" : "password"}
                  className={
                    objCheckInput.isValidOldPassword
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  required
                  onChange={(event) => setOldPassword(event.target.value)}
                  value={oldPassword}
                />{" "}
                <i
                  className={
                    isShowOldPassword === true
                      ? "fa-regular fa-eye "
                      : "fa-regular fa-eye-slash"
                  }
                  onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                ></i>
              </div>{" "}
              <div className="input-group mb-3 input-password">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Mật khẩu mới
                </span>
                <input
                  className={
                    objCheckInput.isValidPassword
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  type={isShowNewPassword === true ? "text" : "password"}
                  required
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />{" "}
                <i
                  className={
                    isShowNewPassword === true
                      ? "fa-regular fa-eye "
                      : "fa-regular fa-eye-slash"
                  }
                  onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                ></i>
              </div>{" "}
              <div className="input-group mb-3 input-password">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Xác nhận mật khẩu
                </span>
                <input
                  className={
                    objCheckInput.isValidConfirmPassword
                      ? "form-control"
                      : "form-control is-invalid"
                  }
                  type={isShowConfirmPassword === true ? "text" : "password"}
                  required
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  value={confirmPassword}
                />{" "}
                <i
                  className={
                    isShowConfirmPassword === true
                      ? "fa-regular fa-eye "
                      : "fa-regular fa-eye-slash"
                  }
                  onClick={() =>
                    setIsShowConfirmPassword(!isShowConfirmPassword)
                  }
                ></i>
              </div>{" "}
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleOnClickEditPassword()}
                >
                  Lưu mới
                </Button>
              </Modal.Footer>
            </CustomTabPanel>
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ModalEditUser;
