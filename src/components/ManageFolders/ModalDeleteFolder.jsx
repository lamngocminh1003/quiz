import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  deleteFolder,
  deleteFolderReference,
} from "../../services/folderService";
import { Box } from "@mui/material";
const ModalDeleteFolder = (props) => {
  const [folderName, setFolderName] = useState("");
  let { handleDeleteFromModal, setShowDelete, showDelete, dataFolders } = props;
  const handleClose = () => {
    setShowDelete(false);
    setIsShowLoadingDelete(false);
  };
  const [isShowLoadingDelete, setIsShowLoadingDelete] = useState(false);
  const [id, setId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      setIsShowLoadingDelete(true);
      let res = await deleteFolder(id, categoryId);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa quy trình thành công");
        handleDeleteFromModal(dataFolders);
        setIsShowLoadingDelete(false);
      } else {
        toast.error("Xóa quy trình không thành công");
        setIsShowLoadingDelete(false);
      }
    } catch (error) {
      toast.error("Xóa quy trình không thành công");
      setIsShowLoadingDelete(false);
    }
  };
  const handDeleteReference = async () => {
    try {
      let res = await deleteFolderReference(dataFolders.categoryId, id);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa quy trình liên kết thành công");
        handleDeleteFromModal(dataFolders);
      } else {
        toast.error("Xóa quy trình liên kết không thành công");
      }
    } catch (error) {
      toast.error("Xóa quy trình liên kết không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setFolderName(dataFolders.folderName);
      setId(dataFolders.id);
      setCategoryId(dataFolders.categoryId);
    }
  }, [dataFolders]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-danger">
            Xóa quy trình
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <p className="input-group" id="inputGroup-sizing-default">
              Bạn có muốn xóa quy trình
              <span className="text-primary mx-1">{folderName}</span> này không?
            </p>
            <p className="input-group mb-3 text-danger">
              <h6>Lưu ý:</h6> Khi xóa các tha chiếu quy trình này tại các thư
              mục, tài liệu và phiên bản thuộc quy trình này sẽ mất!
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between mt-2 ">
          {dataFolders.attachedOn && dataFolders.attachedBy ? (
            <Box>
              <Button variant="danger" onClick={handDeleteReference}>
                {isShowLoadingDelete && (
                  <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                )}
                Xóa liên kết
              </Button>
            </Box>
          ) : (
            <Box></Box>
          )}
          <Box className="d-flex gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" onClick={() => handleOnClickDelete()}>
              Có
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteFolder;
