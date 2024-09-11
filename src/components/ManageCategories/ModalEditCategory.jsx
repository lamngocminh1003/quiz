import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  fetchAllSubjects,
  updateSubject,
} from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
const ModalEditCategory = (props) => {
  const [id, setId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  let { dataCategories, showEdit, setShowEdit, orderBy, descending } = props;
  const dispatch = useDispatch();
  const isLoadingUpdate = useSelector(
    (state) => state.subjects.isLoadingUpdate
  );
  const isErrorUpdate = useSelector((state) => state.subjects.isErrorUpdate);
  const handleClose = () => {
    setShowEdit(false);
    setCategoryName(dataCategories.name);
  };

  const handleOnClickEdit = async () => {
    if (!categoryName) {
      toast.error("Trường tên môn học không được để trống!");
      return;
    }
    try {
      let res = await dispatch(updateSubject({ id, categoryName }));
      if (res.payload.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin môn học thành công");
        setCategoryName("");
        dispatch(fetchAllSubjects({ orderBy, descending }));
      }
    } catch (error) {
      toast.error("Sửa môn học thất bại");
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickEdit();
    }
  };
  useEffect(() => {
    if (showEdit) {
      setCategoryName(dataCategories.name);
      setId(dataCategories.id);
    }
  }, [dataCategories]);
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật môn học
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên môn học&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên môn học"
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
            {isErrorUpdate === false && isLoadingUpdate === true && (
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
