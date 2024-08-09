import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { createNewFolder } from "../../services/folderService";
const ModalAddNewFolders = (props) => {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  let { fetchFoldersByCategoryId, idCategory, sortOption, listFolders } = props;
  const handleClose = () => {
    setShow(false);
    setFolderId("");
    setFolderName("");
  };
  const handleShow = () => setShow(true);
  const inputRefs = useRef([]);
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus();
      } else {
        inputRefs.current[0].focus(); // Focus on the first input field
      }
    }
  };
  const handleInputChange = (e, index) => {
    if (index === 0) {
      setFolderId(e.target.value);
    }
    if (index === 1) {
      setFolderName(e.target.value);
    }
  };
  const addInputRef = (ref, index) => {
    if (ref && !inputRefs.current.includes(ref)) {
      inputRefs.current.push(ref);
      if (index === inputRefs.current.length - 1) {
        ref.onkeydown = (e) => handleKeyDown(e, index);
      }
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickAdd();
    }
  };
  const checkFolderId = (folderId) => {
    for (let i = 0; i < listFolders.length; i++) {
      if (listFolders[i].id === folderId) {
        return true; // Tìm thấy ID trong mảng
      }
    }
    return false; // Không tìm thấy ID trong mảng
  };
  const handleOnClickAdd = async () => {
    if (!folderId) {
      toast.error("Mã quy trình không được bỏ trống!");
      return;
    }
    let check = checkFolderId(folderId);
    if (check === true) {
      toast.error("Mã quy trình không được trùng!");
      return;
    }
    if (!folderName) {
      toast.error("Tên quy trình không được bỏ trống!");
      return;
    }
    try {
      setIsShowLoading(true);
      const res = await createNewFolder(folderId, folderName, idCategory);
      if (res.id) {
        //success
        setShow(false);
        setFolderName("");
        setFolderId("");
        toast.success("Thêm mới quy trình thành công!");
        fetchFoldersByCategoryId(idCategory, sortOption);
      } else {
        toast.error(`${res.data}`);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Thêm mới quy trình thất bại!");
      setIsShowLoading(false);
    }
  };
  return (
    <>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleShow}
        title="Thêm mới quy trình"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới
      </Button>

      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới quy trình
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={idCategory}
            hidden
          />
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Mã quy trình&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập mã quy trình"
              value={folderId}
              ref={(ref) => addInputRef(ref, 0)}
              onChange={(e) => handleInputChange(e, 0)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên quy trình&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên quy trình"
              value={folderName}
              ref={(ref) => addInputRef(ref, 1)}
              onChange={(e) => handleInputChange(e, 1)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickAdd()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewFolders;
