import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  fetchAllComment,
  deleteUserComment,
} from "../../redux/slices/commentsSlice";
import { useDispatch } from "react-redux";
const ModalDeleteComment = (props) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  let { setShowDelete, showDelete, dataComment, from, username } = props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await dispatch(deleteUserComment({ commentId: id }));
      if (res.payload.status === 200) {
        if (from === "manageComment") {
          await dispatch(fetchAllComment({ orderBy: "Id", descending: true }));
        }
        if (from === "profilePage")
          await dispatch(
            fetchAllComment({ orderBy: "Id", descending: true, username })
          );
        setShowDelete(false);
        toast.success("Xóa đánh giá thành công");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Xóa đánh giá không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setContent(dataComment.content);
      setId(dataComment.id);
    }
  }, [dataComment]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa đánh giá
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group mb-3 text-primary">
            Xác nhận xóa đánh giá:&nbsp;
            <span className="text-lowercase font-weight-bold text-danger">
              {content}
            </span>
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
export default ModalDeleteComment;
