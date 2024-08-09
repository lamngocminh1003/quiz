import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteUser } from "../../services/userService";

const ModalDeleteUser = (props) => {
  const [username, setUsername] = useState("");
  let { handleDeleteFromModal, setShowDelete, showDelete, dataUsers } = props;
  useEffect(() => {
    if (showDelete) {
      setUsername(dataUsers.username);
    }
  }, [dataUsers]);
  const handleClose = () => setShowDelete(false);
  const handleOnClickDelete = async () => {
    try {
      let res = await deleteUser(username);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa tài khoản thành công");
        handleDeleteFromModal(dataUsers);
      } else {
        toast.error("Xóa tài khoản không thành công");
      }
    } catch (error) {
      toast.error("Xóa tài khoản không thành công");
    }
  };

  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa tài khoản
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Bạn có muốn xóa tài khoản &nbsp;
              <span className="text-danger">{username}</span>?
            </span>
          </div>
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
export default ModalDeleteUser;
