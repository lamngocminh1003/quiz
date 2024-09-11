import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import {
  fetchAllSubjects,
  deleteSubject,
} from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
const ModalDeleteCategory = (props) => {
  const [categoryName, setCategoryName] = useState("");
  let { setShowDelete, showDelete, dataCategories, orderBy, descending } =
    props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const isLoadingDelete = useSelector(
    (state) => state.subjects.isLoadingDelete
  );
  const isErrorDelete = useSelector((state) => state.subjects.isErrorDelete);
  const handleOnClickDelete = async () => {
    try {
      let res = await dispatch(deleteSubject({ id }));
      if (res.payload.status === 200) {
        //success
        setShowDelete(false);
        toast.success("Xóa môn học thành công");
        dispatch(fetchAllSubjects({ orderBy, descending }));
      } else {
        toast.error("Xóa môn học không thành công");
      }
    } catch (error) {
      toast.error("Xóa môn học không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setCategoryName(dataCategories.name);
      setId(dataCategories.id);
    }
  }, [dataCategories]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa môn học
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group mb-3 text-primary">
            <h6>Lưu ý:</h6>&nbsp; Môn học&nbsp;
            <span className="text-lowercase font-weight-bold text-danger">
              {categoryName}
            </span>
            chỉ được xóa khi không có đề thi liên quan!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickDelete()}>
            {isErrorDelete === false && isLoadingDelete === true && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteCategory;
