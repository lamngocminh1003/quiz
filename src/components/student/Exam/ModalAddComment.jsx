import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { createNewUserComment } from "../../../redux/slices/commentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const ModalAddComment = (props) => {
  let history = useHistory();
  const [comment, setComment] = useState("");
  let { testId, showEdit, setShowEdit } = props;
  const dispatch = useDispatch();
  const isLoadingCreate = useSelector(
    (state) => state.comments.isLoadingCreate
  );
  const [use, setUse] = useState("");

  const isErrorCreate = useSelector((state) => state.comments.isErrorCreate);
  const handleClose = () => {
    setShowEdit(false);
    setComment("");
  };

  const handleAddComment = async () => {
    setUse("handleAddComment");
    if (!comment) {
      toast.error("Đánh giá bài thi không được để trống!");
      return;
    }
    try {
      let res = await dispatch(createNewUserComment({ testId, comment }));
      if (res.payload.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Đánh giá bài thi thành công");
        setComment("");
        history.push(`/exam/${testId}`);
        setUse("");
      }
    } catch (error) {
      toast.error("Đánh giá bài thi thất bại");
    }
  };
  const handleStayExam = async () => {
    setUse("handleStayExam");

    if (!comment) {
      toast.error("Đánh giá bài thi không được để trống!");
      return;
    }
    try {
      let res = await dispatch(createNewUserComment({ testId, comment }));
      if (res.payload.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Đánh giá bài thi thành công");
        setComment("");
        setUse("");
      }
    } catch (error) {
      toast.error("Đánh giá bài thi thất bại");
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleStayExam();
    }
  };
  useEffect(() => {
    if (showEdit) {
      setComment("");
    }
  }, [testId]);
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Đánh giá nội dung bài thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Đánh giá"
              multiline
              rows={4}
              placeholder="Nhập đánh giá"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onKeyDown={(event) => handlePressEnter(event)}
            />{" "}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleStayExam}>
            {use === "handleStayExam" &&
              isErrorCreate === false &&
              isLoadingCreate === true && (
                <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
              )}
            Ở lại bài thi
          </Button>

          <Button variant="primary" onClick={() => handleAddComment()}>
            {use === "handleAddComment" &&
              isErrorCreate === false &&
              isLoadingCreate === true && (
                <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
              )}
            Xem đánh giá
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddComment;
