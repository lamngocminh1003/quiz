import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { UploadFile } from "../../../services/index/MajorStatDetailService";
const ModalUploadFile = (props) => {
  const fileContent = useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const caseSensitive = false;
  const useTransaction = false;
  const defaultState = true;
  let {
    setShowEditFileContent,
    showEditFileContent,
    fileId,
    revisionId,
    fetchAllMajorStatDetailByStatAndYear,
    yearEffective,
    statId,
  } = props;
  const handleClose = () => {
    setShowEditFileContent(false);
    setIsShowLoading(false);
  };
  const handleOnClickEdit = async () => {
    if (!fileContent.current || !fileContent.current.files[0]) {
      toast.error("Nội dung danh sách không được bỏ trống!");
      return;
    }
    const file = fileContent.current.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Vui lòng chọn một tệp CSV!");
        return;
      }
      const data = new FormData();
      data.append("file", file);
      setIsShowLoading(true);
      try {
        let res = await UploadFile(
          revisionId,
          caseSensitive,
          useTransaction,
          defaultState,
          data
        );
        if (res.status === 400) {
          setIsShowLoading(false);
          toast.error("Nội dung file sai định dạng. Vui lòng kiểm tra lại!");
        }
        if (res.status === 200) {
          //success
          setShowEditFileContent(false);
          toast.success("Tải danh sách kết quả khoa/ phòng thành công");
          setIsShowLoading(false);
          fetchAllMajorStatDetailByStatAndYear(statId, yearEffective);
        }
      } catch (error) {
        setIsShowLoading(false);
        toast.error("Nội dung file sai định dạng. Vui lòng kiểm tra lại!");
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
            Tải danh sách kết quả khoa phòng
            <span className="text-warning">{fileId}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=" mb-3 ">
            <label for="formFile" className="form-label me-1">
              Tải danh sách <span className="text-danger">(*)</span>
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
export default ModalUploadFile;
