import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateFileContent } from "../../services/fileService";
const ModalEditFolder = (props) => {
  const fileContent = useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  let { setShowEditFileContent, showEditFileContent, fileId, revisionId } =
    props;
  const handleClose = () => {
    setShowEditFileContent(false);
    setIsShowLoading(false);
  };
  const handleOnClickEdit = async () => {
    if (!fileContent.current || !fileContent.current.files[0]) {
      toast.error("Nội dung tài liệu không được bỏ trống!");
      return;
    }
    const file = fileContent.current.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      setIsShowLoading(true);
      try {
        let res = await updateFileContent(fileId, revisionId, data);
        if (res) {
          //success
          setShowEditFileContent(false);
          toast.success("Cập nhật nội dung tài liệu thành công");
          setIsShowLoading(false);
        }
      } catch (error) {
        setIsShowLoading(false);
        toast.error("Sửa nội dung tài liệu thất bại");
      }
    }
  };
  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showEditFileContent}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật nội dung tài liệu
            <span className="text-warning">{fileId}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=" mb-3 ">
            <label for="formFile" className="form-label me-1">
              Tải tài liệu lên <span className="text-danger">(*)</span>
            </label>
            <input type="file" id="file" ref={fileContent} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            <span style={{ display: "flex", alignItems: "center" }}>
              {isShowLoading && (
                <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
              )}
              <span>Lưu</span>
            </span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditFolder;
