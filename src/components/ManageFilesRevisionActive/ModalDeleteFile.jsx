import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteFile } from "../../services/fileService";
const ModalDeleteFile = (props) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [revisionId, setRevisionId] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  let { handleDeleteFromModal, setShowDelete, showDelete, dataFlies } = props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await deleteFile(id, revisionId);
      setIsShowLoading(true);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa tài liệu thành công");
        handleDeleteFromModal(dataFlies);
        setIsShowLoading(false);
      } else {
        toast.error("Xóa tài liệu không thành công");
        setIsShowLoading(false);
      }
    } catch (error) {
      toast.error("Xóa tài liệu không thành công");
      setIsShowLoading(false);
    }
  };
  useEffect(() => {
    if (showDelete) {
      setFileName(dataFlies?.fileName);
      setFileType(dataFlies?.fileExtension);
      setId(dataFlies?.id);
      setRevisionId(dataFlies?.revisionId);
    }
  }, [dataFlies]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa tài liệu <span className="text-warning">{id}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <p className="input-group" id="inputGroup-sizing-default">
              <span>
                Bạn có muốn xóa tài liệu có tên
                <span className="text-primary">{fileName}</span> có kiểu
                <span className="text-primary">{fileType}</span> ?
              </span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickDelete()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-3 text-white"></i>
            )}
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteFile;
