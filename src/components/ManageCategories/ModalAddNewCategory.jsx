import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  fetchAllSubjects,
  createNewSubject,
} from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
const ModalAddNewCategory = (props) => {
  const { orderBy, descending } = props;
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const isLoadingCreate = useSelector(
    (state) => state.subjects.isLoadingCreate
  );
  const isErrorCreate = useSelector((state) => state.subjects.isErrorCreate);
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickAdd();
    }
  };
  const handleClose = () => {
    setCategoryName("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAdd = async () => {
    if (!categoryName) {
      toast.error("Tên môn học không được bỏ trống!");
      return;
    }
    let res = await dispatch(createNewSubject(categoryName));
    if (res.payload.status === 200) {
      //success
      setShow(false);
      setCategoryName("");
      toast.success("Thêm mới môn học thành công!");
      dispatch(fetchAllSubjects({ orderBy, descending }));
    }
  };
  return (
    <>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleShow}
        title="Thêm mới môn học"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới môn học
      </Button>

      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới môn học
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button variant="primary" onClick={() => handleOnClickAdd()}>
            {isLoadingCreate === true && isErrorCreate === false && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewCategory;
