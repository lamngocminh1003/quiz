import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ModalDownloadFile = (props) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  let { downloadToken, showDownload, setShowDownload, dataFlies } = props;
  const handleClose = () => setShowDownload(false);
  const [id, setId] = useState("");
  useEffect(() => {
    if (showDownload) {
      setFileName(dataFlies?.fileName);
      setFileType(dataFlies?.fileExtension);
      setId(dataFlies?.fileId);
    }
  }, [dataFlies]);
  return (
    <>
      <Modal
        show={showDownload}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Tải tài liệu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <p className="input-group" id="inputGroup-sizing-default">
              <span>
                Bạn có muốn tải tài liệu
                <span className="text-primary">{fileName}</span> có kiểu file là
                <span className="text-primary">{fileType}</span>?
              </span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <button
            className="btn btn-success"
            title="Tải tài liệu"
            onClick={() => {
              const downloadLink = `${backendURL}/api/v1/File/download?downloadToken=${downloadToken}`; // Thay thế bằng URL tải về thực tế
              const a = document.createElement("a");
              a.href = downloadLink;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              a.click();
            }}
          >
            <i className="fa-solid fa-download me-1"></i> Tải file
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDownloadFile;
