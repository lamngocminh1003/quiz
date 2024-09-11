import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteExam, fetchAllExams } from "../../redux/slices/examsSlice";
import { Box } from "@mui/material";
const ModalDeleteFolder = (props) => {
  const [folderName, setFolderName] = useState("");
  const dispatch = useDispatch();
  let { setShowDelete, showDelete, dataFolders, orderBy, descending } = props;
  const handleClose = () => {
    setShowDelete(false);
  };
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await dispatch(deleteExam(id));
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa đề thi thành công");
        dispatch(fetchAllExams({ orderBy, descending }));
      } else {
        toast.error("Xóa đề thi không thành công");
      }
    } catch (error) {
      toast.error("Xóa đề thi không thành công");
    }
  };

  useEffect(() => {
    if (showDelete) {
      setFolderName(dataFolders.description);
      setId(dataFolders.id);
    }
  }, [dataFolders]);

  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-danger">
            Xóa đề thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <p className="input-group" id="inputGroup-sizing-default">
              Bạn có muốn xóa đề thi
              <span className="text-primary mx-1">{folderName}</span> này không?
            </p>
            <p className="input-group mb-3 text-danger">
              <h6>Lưu ý:</h6> Khi xóa đề thi này các đáp án và kết quả liên quan
              sẽ mất!
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end mt-2 ">
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
