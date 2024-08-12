import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteMajorStat } from "../../services/index/MajorStatService";
const ModalDeleteComment = (props) => {
  const [statName, setStatName] = useState("");
  let { setShowDelete, showDelete, dataIndex, fetchListMajorStatsAndManifest } =
    props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await deleteMajorStat(id);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa bình luận thành công");
        fetchListMajorStatsAndManifest();
      } else {
        toast.error("Xóa bình luận không thành công");
      }
    } catch (error) {
      toast.error("Xóa bình luận không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setStatName(dataIndex.statName);
      setId(dataIndex.id);
    }
  }, [dataIndex]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa bình luận
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group mb-3 text-primary">
            Xác nhận xóa bình luận&nbsp;
            <span className="text-lowercase font-weight-bold text-danger">
              {statName}
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
