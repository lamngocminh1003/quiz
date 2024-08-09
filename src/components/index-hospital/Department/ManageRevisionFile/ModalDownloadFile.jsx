import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ModalDownloadFile = (props) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  let { downloadToken, showDownload, setShowDownload, dataFlies } = props;
  const token = localStorage.getItem("token");
  const handleClose = () => setShowDownload(false);
  const [id, setId] = useState("");
  useEffect(() => {
    if (showDownload) {
      setFileName(dataFlies?.fileName);
      setFileType(dataFlies?.fileExtension);
      setId(dataFlies?.fileId);
    }
  }, [dataFlies]);
  const handleDownload = async () => {
    try {
      const response = await axios({
        url: `${backendURL}/api/v1/MinorStatRepositoryNotes/download?downloadToken=${downloadToken}`,
        method: "GET",
        responseType: "blob", // Chỉ định kiểu dữ liệu của phản hồi là blob
        params: {
          downloadToken: downloadToken, // Thay 'your_downloadToken_here' bằng downloadToken của bạn
        },
        headers: {
          Authorization: `Bearer ${token}`, // Thay 'your_token_here' bằng token của bạn
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download = `${dataFlies?.fileName}`; // Thay 'file_name' bằng tên file mong muốn
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Xử lý lỗi
    }
  };
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
            onClick={() => handleDownload()}
          >
            <i className="fa-solid fa-download me-1"></i> Tải file
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDownloadFile;
