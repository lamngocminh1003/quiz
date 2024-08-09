import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteRevision } from "../../services/revisionService";
const ModalDeleteRevision = (props) => {
  const [folderName, setFolderName] = useState("");
  let { handleDeleteFromModal, setShowDelete, showDelete, dataRevision } =
    props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    let res = await deleteRevision(id);
    if (res) {
      //success
      setShowDelete(false);
      toast.success(`Xóa phiên bản của quy trình thành công`);
      handleDeleteFromModal(dataRevision);
    } else {
      toast.error(`Xóa phiên bản của quy trình không thành công`);
    }
  };
  useEffect(() => {
    if (showDelete) {
      setFolderName(dataRevision?.folder?.folderName);
      setId(dataRevision.id);
    }
  }, [dataRevision]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa phiên bản hết hạn của quy trình {folderName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group" id="inputGroup-sizing-default">
            Bạn có muốn xóa phiên bản hết hạn của quy trình {folderName} này
            không?
          </p>
          <p className="input-group mb-3 text-danger">
            <h6>Lưu ý:</h6>&nbsp; Khi xóa, các tài liệu thuộc quy trình này sẽ
            mất!
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
export default ModalDeleteRevision;
