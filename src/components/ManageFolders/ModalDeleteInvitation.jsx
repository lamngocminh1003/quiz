import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteUserInvitations } from "../../services/examService";
import { fetchAllUsersByTestIdRedux } from "../../redux/slices/usersSlice";
import { useDispatch } from "react-redux";
const ModalDeleteInvitation = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  let { setShowDelete, showDelete, dataUser, testId } = props;

  const handleClose = () => setShowDelete(false);
  const [username, setUserName] = useState("");
  const handleOnClickDelete = async () => {
    try {
      await deleteUserInvitations({
        testId: testId,
        usernames: [username], // Đảm bảo username nằm trong mảng
      });
      await dispatch(fetchAllUsersByTestIdRedux(testId));
      setShowDelete(false);
      toast.success("Xóa truy cập thành công");
      handleClose();
    } catch (error) {
      console.log("error", error);
      toast.error("Xóa truy cập không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setName(dataUser.name);
      setUserName(dataUser.username);
    }
  }, [dataUser]);
  username;
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa truy cập
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={username} hidden />
          <p className="input-group mb-3 text-primary">
            Xác nhận xóa tài khoản truy cập:&nbsp;
            <span className="font-weight-bold text-danger">{name}</span>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickDelete()}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteInvitation;
