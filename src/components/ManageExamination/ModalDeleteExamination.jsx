import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";
import { deleteExamination } from "../../services/examinationService";
import { useDispatch } from "react-redux";
const ModalDeleteExamination = (props) => {
  const [exam, setExam] = useState({
    id: "",
    examName: "",
  });
  let {
    setShowDelete,
    showDelete,
    dataExamination,
    orderBy,
    descending,
    username,
    from,
  } = props;
  const handleClose = () => {
    // Reset the state values when closing
    setExam({
      id: "",
      examName: "",
    });
    setShow(false);
  };
  const dispatch = useDispatch();

  const handleOnClickDelete = async () => {
    try {
      let res = await deleteExamination(exam.id);
      if (res.status === 200) {
        //success
        setShowDelete(false);
        toast.success("Xóa kỳ thi thành công");
        if ((from = "profilePage")) {
          dispatch(
            fetchAllExaminationRedux({
              orderBy,
              descending,
              CreatorId: username,
            })
          );
        } else {
          dispatch(fetchAllExaminationRedux({ orderBy, descending }));
        }
      } else {
        toast.error("Xóa kỳ thi không thành công");
      }
    } catch (error) {
      toast.error("Xóa kỳ thi không thành công");
    }
  };
  useEffect(() => {
    if (showDelete && dataExamination) {
      setExam({
        id: dataExamination.id || "",
        examName: dataExamination.examName || "",
      });
    }
  }, [dataExamination]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa kỳ thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="input-group mb-3 text-primary">
            <h6>Lưu ý:</h6>&nbsp; kỳ thi&nbsp;
            <span className="font-weight-bold text-danger">
              {dataExamination.examName}
            </span>
            chỉ được xóa khi không có đề thi liên quan!
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
export default ModalDeleteExamination;
