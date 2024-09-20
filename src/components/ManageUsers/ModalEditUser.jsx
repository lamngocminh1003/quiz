import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateUser } from "../../services/userService";
import { getUserByUsernameRedux } from "../../redux/slices/usersSlice";
import { useDispatch } from "react-redux";
const ModalEditUser = (props) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  let { setShowEdit, showEdit, dataUsers } = props;
  const handleClose = () => {
    setShowEdit(false);
    setName(dataUsers.uniqueName);
    setUsername(dataUsers.username);
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

  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Chỉnh sửa thông tin cá nhân
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
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
            <span className="input-group-text" id="inputGroup-sizing-default">
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
            <span className="input-group-text" id="inputGroup-sizing-default">
              Họ tên
            </span>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditUser;
