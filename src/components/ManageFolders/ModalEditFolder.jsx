import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateFolder } from "../../services/folderService";
const ModalEditFolder = (props) => {
  const [id, setId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  let { handleEditTable, setShowEdit, showEdit, dataFolders } = props;
  const handleClose = () => {
    setShowEdit(false);
    setFolderName(dataFolders.folderName);
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickEdit();
    }
  };
  const handleOnClickEdit = async () => {
    if (!folderName) {
      toast.error("Trường tên quy trình không được để trống!");
      return;
    }
    try {
      let res = await updateFolder(id, categoryId, folderName);
      setIsShowLoading(true);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin quy trình thành công");
        handleEditTable({
          folderName: dataFolders.folderName,
          id: dataFolders.id,
        });
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Cập nhật thông tin quy trình thất bại");
    }
  };
  useEffect(() => {
    if (showEdit) {
      setFolderName(dataFolders.folderName);
      setId(dataFolders.id);
      setCategoryId(dataFolders.categoryId);
    }
  }, [dataFolders]);
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Chỉnh sửa quy trình
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên quy trình&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditFolder;
