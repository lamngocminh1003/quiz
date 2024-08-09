import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteMinorStatManifest } from "../../../../services/index/DepartmentStat/MinorStatManifestService";
const ModalDeleteRevision = (props) => {
  let { handleDeleteFromModal, setShowDelete, showDelete, dataRevision } =
    props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    let res = await deleteMinorStatManifest(id);
    if (res) {
      //success
      setShowDelete(false);
      toast.success(`Xóa phiên bản công thức của chỉ số thành công`);
      handleDeleteFromModal(dataRevision);
    } else {
      toast.error(`Xóa phiên bản công thức của chỉ số không thành công`);
    }
  };
  useEffect(() => {
    if (showDelete) {
      setId(dataRevision.hash);
    }
  }, [dataRevision]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa phiên bản công thức của chỉ số
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group" id="inputGroup-sizing-default">
            Bạn có muốn xóa phiên bản công thức của chỉ số này không?
          </p>
          <p className="input-group mb-3 text-danger">
            <h6>Lưu ý:</h6>&nbsp; Khi xóa, các đánh giá thuộc công thức này sẽ
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
