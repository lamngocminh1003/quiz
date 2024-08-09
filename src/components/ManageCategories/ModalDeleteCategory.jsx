import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteCategory } from "../../services/categoryService";
const ModalDeleteCategory = (props) => {
  const [categoryName, setCategoryName] = useState("");
  let { handleDeleteFromModal, setShowDelete, showDelete, dataCategories } =
    props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await deleteCategory(id);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa thư mục thành công");
        handleDeleteFromModal(dataCategories);
      } else {
        toast.error("Xóa thư mục không thành công");
      }
    } catch (error) {
      toast.error("Xóa thư mục không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setCategoryName(dataCategories.categoryName);
      setId(dataCategories.id);
    }
  }, [dataCategories]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa thư mục
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group mb-3 text-primary">
            <h6>Lưu ý:</h6>&nbsp; Thư mục&nbsp;
            <span className="text-lowercase font-weight-bold text-danger">
              {categoryName}
            </span>
            chỉ được xóa khi không có tài khoản và thư mục quy trình liên quan!
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
export default ModalDeleteCategory;
