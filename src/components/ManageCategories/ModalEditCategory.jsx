import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateCategory } from "../../services/categoryService";
const ModalEditCategory = (props) => {
  const [id, setId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  let { dataCategories, showEdit, setShowEdit, fetchCategories } = props;
  const handleClose = () => {
    setShowEdit(false);
    setCategoryName(dataCategories.categoryName);
  };
  const defaultFilePermission = 3;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const handleOnClickEdit = async () => {
    if (!categoryName) {
      toast.error("Trường tên thư mục không được để trống!");
      return;
    }
    try {
      setIsShowLoading(true);
      let res = await updateCategory(id, categoryName, defaultFilePermission);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin thư mục thành công");
        setCategoryName("");
        fetchCategories();
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Sửa thư mục thất bại");
      setIsShowLoading(false);
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickEdit();
    }
  };
  useEffect(() => {
    if (showEdit) {
      setCategoryName(dataCategories.categoryName);
      setId(dataCategories.id);
    }
  }, [dataCategories]);
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật thư mục
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên thư mục&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên thư mục"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
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
export default ModalEditCategory;
